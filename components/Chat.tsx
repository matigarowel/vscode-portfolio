'use client';

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { VscAdd, VscSend, VscSparkle } from 'react-icons/vsc';

import styles from '@/styles/Chat.module.css';
import MarkdownMessage from './MarkdownMessage';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  toolCalls?: ToolCall[];
}

interface ToolCall {
  id: string;
  callId: string;
  index?: number;
  name: string;
  arguments: string;
  output?: string;
  status: 'running' | 'requested' | 'completed';
}

const suggestedPrompts = [
  "What can you tell me about Rowel's experience?",
  'Which projects has Rowel worked on?',
  'What technologies does Rowel use?',
  'What is Rowel career timeline?',
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function serializeArguments(value: unknown): string {
  if (typeof value === 'string') return value;
  if (value === undefined || value === null) return '';
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function serializeToolOutput(value: unknown): string | undefined {
  if (!isRecord(value)) return undefined;

  const results = isRecord(value.results) ? value.results : null;
  if (results && typeof results.content === 'string') {
    return results.content;
  }

  const artifact = isRecord(value.artifact) ? value.artifact : null;
  if (artifact && Array.isArray(artifact.content)) {
    const text = artifact.content
      .filter(
        (item): item is Record<string, unknown> =>
          isRecord(item) && typeof item.text === 'string',
      )
      .map((item) => item.text as string)
      .join('\n');
    if (text) return text;
  }

  return results ? serializeArguments(results) : undefined;
}

function extractResponseText(result: unknown): string {
  if (!isRecord(result)) return '';
  const textParts: string[] = [];
  if (typeof result.output_text === 'string' && result.output_text) {
    textParts.push(result.output_text);
  } else if (Array.isArray(result.output)) {
    for (const item of result.output) {
      if (
        !isRecord(item) ||
        item.type !== 'message' ||
        (item.role !== undefined && item.role !== 'assistant') ||
        !Array.isArray(item.content)
      ) {
        continue;
      }

      for (const content of item.content) {
        if (!isRecord(content)) continue;
        if (
          (content.type === 'output_text' || content.type === 'text') &&
          typeof content.text === 'string'
        ) {
          textParts.push(content.text);
        } else if (
          content.type === 'refusal' &&
          typeof content.refusal === 'string'
        ) {
          textParts.push(content.refusal);
        }
      }
    }
  }

  return textParts.join('\n').trim();
}

function addToolCall(value: unknown, toolCalls: ToolCall[]) {
  if (!isRecord(value)) return;

  if (value.type === 'tool_call') {
    const name =
      typeof value.tool_name === 'string'
        ? value.tool_name
        : typeof value.name === 'string'
          ? value.name
          : 'Tool';
    const id =
      typeof value.id === 'string'
        ? value.id
        : typeof value.tool_call_id === 'string'
          ? value.tool_call_id
          : crypto.randomUUID();
    const output = serializeToolOutput(value);
    const existingCall = toolCalls.find(
      (call) =>
        call.name === name &&
        (call.status === 'requested' || call.status === 'running'),
    );

    if (existingCall) {
      existingCall.output = output;
      existingCall.status = 'completed';
      if (!existingCall.arguments) {
        existingCall.arguments = serializeArguments(value.inputs);
      }
    } else {
      toolCalls.push({
        id,
        callId:
          typeof value.tool_call_id === 'string' ? value.tool_call_id : id,
        name,
        arguments: serializeArguments(value.inputs),
        ...(output !== undefined ? { output } : {}),
        status: 'completed',
      });
    }
    return;
  }

  if (
    value.type === 'function_call' ||
    value.type === 'custom_tool_call' ||
    value.type === 'web_search_call' ||
    value.type === 'file_search_call' ||
    value.type === 'computer_call' ||
    value.type === 'code_interpreter_call' ||
    value.type === 'mcp_call'
  ) {
    const id = typeof value.id === 'string' ? value.id : null;
    const callId =
      typeof value.call_id === 'string' ? value.call_id : id;
    if (!id || !callId || toolCalls.some((call) => call.id === id)) return;

    const toolName =
      typeof value.name === 'string'
        ? value.name
        : value.type
          .replace(/_call$/, '')
          .split('_')
          .map((part) => part[0].toUpperCase() + part.slice(1))
          .join(' ');
    const toolArguments = serializeArguments(
      value.arguments ?? value.input ?? value.action,
    );
    const existingCall = toolCalls.find(
      (call) => call.id === id || call.callId === callId,
    );
    if (existingCall) {
      existingCall.name = toolName || existingCall.name;
      if (toolArguments) existingCall.arguments = toolArguments;
      existingCall.status = 'running';
    } else {
      toolCalls.push({
        id,
        callId,
        name: toolName || 'Tool',
        arguments: toolArguments,
        status: 'running',
      });
    }
  } else if (value.type === 'function_call_output') {
    const callId = typeof value.call_id === 'string' ? value.call_id : null;
    if (!callId) return;
    const call = toolCalls.find((item) => item.callId === callId);
    const output =
      typeof value.output === 'string'
        ? value.output
        : JSON.stringify(value.output ?? '');
    if (call) {
      call.output = output;
      call.status = 'completed';
    } else {
      toolCalls.push({
        id: callId,
        callId,
        name: 'Tool result',
        arguments: '',
        output,
        status: 'completed',
      });
    }
  }
}

function updateToolCallFromDelta(value: unknown, toolCalls: ToolCall[]) {
  if (!isRecord(value)) return;

  const index = typeof value.index === 'number' ? value.index : undefined;
  const functionDelta = isRecord(value.function) ? value.function : null;
  const customDelta = isRecord(value.custom) ? value.custom : null;
  const callId = typeof value.id === 'string' ? value.id : null;
  let call = toolCalls.find(
    (candidate) =>
      (callId && (candidate.id === callId || candidate.callId === callId)) ||
      (index !== undefined && candidate.index === index),
  );

  if (!call) {
    const id = callId ?? `stream-tool-${index ?? toolCalls.length}`;
    call = {
      id,
      callId: callId ?? id,
      ...(index !== undefined ? { index } : {}),
      name: '',
      arguments: '',
      status: 'running',
    };
    toolCalls.push(call);
  } else if (callId && call.callId.startsWith('stream-tool-')) {
    call.callId = callId;
    call.id = callId;
  }

  const nameDelta =
    (functionDelta && functionDelta.name) ??
    (customDelta && customDelta.name) ??
    value.name;
  if (typeof nameDelta === 'string') call.name += nameDelta;

  const argumentsDelta =
    (functionDelta && functionDelta.arguments) ??
    (customDelta && customDelta.input) ??
    value.arguments ??
    value.input;
  if (typeof argumentsDelta === 'string') {
    if (!call.arguments && argumentsDelta === '{}') return;
    if (call.arguments === '{}' && argumentsDelta) call.arguments = '';
    call.arguments += argumentsDelta;
  } else if (argumentsDelta !== undefined && argumentsDelta !== null) {
    call.arguments = serializeArguments(argumentsDelta);
  }
}

function updateToolCallsFromDelta(delta: unknown, toolCalls: ToolCall[]) {
  if (!isRecord(delta)) return;

  if (Array.isArray(delta.tool_calls)) {
    delta.tool_calls.forEach((toolCall) =>
      updateToolCallFromDelta(toolCall, toolCalls),
    );
  }

  if (isRecord(delta.function_call)) {
    updateToolCallFromDelta(
      { ...delta.function_call, index: delta.function_call.index ?? 0 },
      toolCalls,
    );
  }

  if (isRecord(delta.tool_call)) {
    updateToolCallFromDelta(delta.tool_call, toolCalls);
  }
}

function finishToolCall(value: unknown, toolCalls: ToolCall[]) {
  if (!isRecord(value)) return;
  if (
    value.type === 'function_call' ||
    value.type === 'custom_tool_call' ||
    value.type === 'web_search_call' ||
    value.type === 'file_search_call' ||
    value.type === 'computer_call' ||
    value.type === 'code_interpreter_call' ||
    value.type === 'mcp_call'
  ) {
    const id = typeof value.id === 'string' ? value.id : null;
    addToolCall(value, toolCalls);
    const call = toolCalls.find(
      (item) => item.id === id || item.callId === value.call_id,
    );
    if (call) call.status = 'requested';
  } else {
    addToolCall(value, toolCalls);
  }
}

function handleEventData(
  frame: string,
  handleEvent: (eventData: unknown) => void,
) {
  const lines = frame.split(/\r?\n/);
  const eventName = lines
    .find((line) => line.startsWith('event:'))
    ?.slice(6)
    .trim();
  const data = lines
    .filter((line) => line.startsWith('data:'))
    .map((line) => line.slice(5).trimStart())
    .join('\n');
  if (!data || data === '[DONE]') {
    if (eventName) handleEvent({ type: eventName });
    return;
  }

  try {
    const eventData: unknown = JSON.parse(data);
    if (
      eventName &&
      isRecord(eventData) &&
      typeof eventData.type !== 'string'
    ) {
      handleEvent({ ...eventData, type: eventName });
    } else {
      handleEvent(eventData);
    }
  } catch (error) {
    console.error('Could not parse a Responses API stream event:', error);
  }
}

function getResponseError(result: unknown): string | null {
  if (!isRecord(result)) return null;
  if (typeof result.error === 'string') return result.error;
  if (isRecord(result.error) && typeof result.error.message === 'string') {
    return result.error.message;
  }
  return null;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState('');
  const [previousResponseId, setPreviousResponseId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    transcriptRef.current?.scrollTo({
      top: transcriptRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, isSending]);

  const sendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text || isSending) return;

    setDraft('');
    setError(null);
    setIsSending(true);
    setMessages((current) => [
      ...current,
      { id: crypto.randomUUID(), role: 'user', text },
    ]);

    let assistantId: string | null = null;
    let assistantText = '';
    const toolCalls: ToolCall[] = [];

    try {
      const response = await fetch('http://localhost:37860/api/v1/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/event-stream',
          'x-api-key': process.env.LANGFLOW_API_KEY || '',
        },
        body: JSON.stringify({
          model: 'b81e9b6e-babd-4d49-8c64-a8cf352c0f91',
          input: text,
          stream: true,
          ...(previousResponseId
            ? { previous_response_id: previousResponseId }
            : {}),
          include: ["tool_call.results"]
        }),
      });
      if (!response.ok) {
        const errorBody: unknown = await response.json().catch(() => null);
        throw new Error(getResponseError(errorBody) || `The chat service returned an error (${response.status}).`);
      }
      if (!response.body) {
        throw new Error('The Responses API did not return a readable stream.');
      }

      assistantId = crypto.randomUUID();
      const currentAssistantId = assistantId;
      setMessages((current) => [
        ...current,
        { id: currentAssistantId, role: 'assistant', text: '', toolCalls: [] },
      ]);

      let responseId: string | null = null;
      let streamError: string | null = null;
      let streamCompleted = false;
      const updateAssistantMessage = () => {
        const messageId = assistantId;
        if (!messageId) return;
        setMessages((current) =>
          current.map((message) =>
            message.id === messageId
              ? { ...message, text: assistantText, toolCalls: [...toolCalls] }
              : message,
          ),
        );
      };

      const handleEvent = (eventData: unknown) => {
        if (!isRecord(eventData)) return;
        const eventType =
          typeof eventData.type === 'string' ? eventData.type : '';

        if (Array.isArray(eventData.choices)) {
          for (const choice of eventData.choices) {
            if (!isRecord(choice) || !isRecord(choice.delta)) continue;
            const delta = choice.delta;
            if (typeof delta.content === 'string') {
              assistantText += delta.content;
            }
            updateToolCallsFromDelta(delta, toolCalls);
          }
          if (
            eventData.choices.some(
              (choice) =>
                isRecord(choice) &&
                choice.finish_reason !== null &&
                choice.finish_reason !== undefined,
            )
          ) {
            streamCompleted = true;
          }
          updateAssistantMessage();
          return;
        }

        if (eventData.object === 'response.chunk') {
          if (typeof eventData.id === 'string') responseId = eventData.id;
          if (isRecord(eventData.delta)) {
            if (typeof eventData.delta.content === 'string') {
              assistantText += eventData.delta.content;
            }
            updateToolCallsFromDelta(eventData.delta, toolCalls);
          }
          if (
            eventType === 'response.completed' ||
            eventData.status === 'completed' ||
            (typeof eventData.finish_reason === 'string' &&
              eventData.finish_reason.length > 0)
          ) {
            streamCompleted = true;
            if (responseId) setPreviousResponseId(responseId);
          }
          updateAssistantMessage();
          return;
        }

        if (
          eventType === 'response.created' ||
          eventType === 'response.in_progress' ||
          eventType === 'response.completed'
        ) {
          const responseData = isRecord(eventData.response)
            ? eventData.response
            : null;
          if (typeof responseData?.id === 'string') responseId = responseData.id;
          if (eventType === 'response.completed') {
            streamCompleted = true;
            if (responseId) setPreviousResponseId(responseId);
            if (responseData && !assistantText) {
              assistantText = extractResponseText(responseData);
            }
          }
        } else if (
          eventType === 'response.output_text.delta' ||
          eventType === 'response.refusal.delta'
        ) {
          if (typeof eventData.delta === 'string') {
            assistantText += eventData.delta;
          }
        } else if (eventType === 'response.output_item.added') {
          addToolCall(eventData.item, toolCalls);
        } else if (
          (eventType === 'response.function_call_arguments.delta' ||
            eventType === 'response.custom_tool_call_input.delta') &&
          typeof eventData.item_id === 'string' &&
          typeof eventData.delta === 'string'
        ) {
          const toolCall = toolCalls.find((item) => item.id === eventData.item_id);
          if (toolCall) toolCall.arguments += eventData.delta;
        } else if (
          (eventType === 'response.function_call_arguments.done' ||
            eventType === 'response.custom_tool_call_input.done') &&
          typeof eventData.item_id === 'string' &&
          (typeof eventData.arguments === 'string' ||
            typeof eventData.input === 'string')
        ) {
          const toolCall = toolCalls.find((item) => item.id === eventData.item_id);
          if (toolCall) {
            toolCall.arguments = serializeArguments(
              eventData.arguments ?? eventData.input,
            );
          }
        } else if (eventType === 'response.output_item.done') {
          finishToolCall(eventData.item, toolCalls);
        } else if (eventType === 'response.failed' || eventType === 'error') {
          const responseData = isRecord(eventData.response)
            ? eventData.response
            : null;
          streamError =
            getResponseError(responseData ?? eventData) ||
            'The Responses API stream failed.';
        }

        updateAssistantMessage();
      };

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let streamFinished = false;

      while (!streamFinished) {
        const { value, done } = await reader.read();
        buffer += decoder.decode(value, { stream: !done });

        let boundary = buffer.search(/\r?\n\r?\n/);
        while (boundary !== -1) {
          const separator = buffer.slice(boundary).match(/^\r?\n\r?\n/)?.[0];
          if (!separator) break;
          handleEventData(buffer.slice(0, boundary), handleEvent);
          buffer = buffer.slice(boundary + separator.length);
          boundary = buffer.search(/\r?\n\r?\n/);
        }

        if (done) {
          if (buffer.trim()) handleEventData(buffer, handleEvent);
          streamFinished = true;
        }
      }

      if (streamError) throw new Error(streamError);
      if (!streamCompleted && responseId) {
        setPreviousResponseId(responseId);
      }
      if (!assistantText.trim() && toolCalls.length === 0) {
        throw new Error('The Responses API stream returned no response.');
      }
    } catch (sendError) {
      if (assistantId && !assistantText && toolCalls.length === 0) {
        setMessages((current) =>
          current.filter((message) => message.id !== assistantId),
        );
      }
      setError(
        sendError instanceof Error
          ? sendError.message
          : 'The chat service could not respond.',
      );
    } finally {
      setIsSending(false);
      requestAnimationFrame(() => {
        transcriptRef.current?.scrollTo({
          top: transcriptRef.current.scrollHeight,
          behavior: 'smooth',
        });
      });
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  const startNewChat = () => {
    if (isSending) return;
    setMessages([]);
    setDraft('');
    setPreviousResponseId(null);
    setError(null);
  };

  return (
    <aside className={styles.chat} aria-label="Chat">
      <header className={styles.header}>
        <p className={styles.title}>CHAT</p>
        <button
          className={styles.iconButton}
          type="button"
          aria-label="New chat"
          title="New chat"
          onClick={startNewChat}
          disabled={isSending || messages.length === 0}
        >
          <VscAdd />
        </button>
      </header>

      <div className={styles.transcript} ref={transcriptRef} aria-live="polite">
        {messages.length === 0 ? (
          <div className={styles.welcome}>
            <span className={styles.sparkle}><VscSparkle /></span>
            <h2>How can I help?</h2>
            <p>Ask me about my work, projects, or experience.</p>
            <div className={styles.suggestions} aria-label="Suggested prompts">
              {suggestedPrompts.map((prompt) => (
                <button
                  className={styles.suggestion}
                  key={prompt}
                  type="button"
                  onClick={() => {
                    setDraft(prompt);
                    textareaRef.current?.focus();
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.messages}>
            {messages.map((message) => (
              <article
                className={`${styles.message} ${message.role === 'user' ? styles.userMessage : styles.assistantMessage
                  }`}
                key={message.id}
              >
                {message.role === 'assistant' && (
                  <span className={styles.messageIcon} aria-hidden="true">
                    <VscSparkle />
                  </span>
                )}
                <div className={styles.assistantContent}>
                  {message.toolCalls?.map((toolCall) => (
                    <details
                      className={styles.toolCall}
                      key={toolCall.id}
                      open={toolCall.status === 'running'}
                    >
                      <summary>
                        <span>{toolCall.name}</span>
                        <span
                          className={
                            toolCall.status === 'running'
                              ? styles.toolRunning
                              : styles.toolCompleted
                          }
                        >
                          {toolCall.status === 'running'
                            ? 'Preparing'
                            : toolCall.status === 'requested'
                              ? 'Requested'
                              : 'Complete'}
                        </span>
                      </summary>
                      {toolCall.arguments && (
                        <div className={styles.toolSection}>
                          <span>Arguments</span>
                          {toolCall.arguments === '{}' ? (
                            <p>No arguments required.</p>
                          ) : (
                            <pre>{toolCall.arguments}</pre>
                          )}
                        </div>
                      )}
                      {toolCall.output !== undefined && (
                        <div className={styles.toolSection}>
                          <span>Output</span>
                          <pre>{toolCall.output}</pre>
                        </div>
                      )}
                    </details>
                  ))}
                  {message.text && <MarkdownMessage content={message.text} />}
                </div>
              </article>
            ))}
            {isSending && (
              <p className={styles.thinking} role="status">
                <VscSparkle aria-hidden="true" />
                <span>Thinking</span>
                <span className={styles.thinkingDots} aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
              </p>
            )}
          </div>
        )}
        {error && <p className={styles.error} role="alert">{error}</p>}
      </div>

      <form className={styles.composer} onSubmit={sendMessage}>
        <textarea
          ref={textareaRef}
          aria-label="Ask a question"
          placeholder="Ask a question..."
          rows={3}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isSending}
        />
        <div className={styles.composerFooter}>
          <span className={styles.modelLabel}>Langflow</span>
          <button
            className={styles.sendButton}
            type="submit"
            aria-label="Send message"
            title="Send message"
            disabled={!draft.trim() || isSending}
          >
            <VscSend />
          </button>
        </div>
      </form>
      <p className={styles.disclaimer}>AI-generated responses may be inaccurate.</p>
    </aside>
  );
};

export default Chat;
