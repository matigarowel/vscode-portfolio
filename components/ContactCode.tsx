import styles from '@/styles/ContactCode.module.css';

const contactItems = [
  {
    social: 'website',
    link: 'matigabusiness.online',
    href: 'https://matigabusiness.online',
  },
  {
    social: 'email',
    link: 'matigarowel@gmail.com',
    href: 'mailto:matigarowel@gmail.com',
  },
  {
    social: 'github',
    link: 'matigarowel',
    href: 'https://github.com/matigarowel',
  },
  {
    social: 'linkedin',
    link: 'matigarowel',
    href: 'https://www.linkedin.com/in/rowel-matiga-729aa0b7',
  },
  {
    social: 'phone number',
    link: '+639352292300',
    href: 'tel:+639352292300',
  },
];

const ContactCode = () => {
  return (
    <div className={styles.code}>
      <p className={styles.line}>
        <span className={styles.className}>.socials</span> &#123;
      </p>
      {contactItems.map((item, index) => (
        <p className={styles.line} key={index}>
          &nbsp;&nbsp;&nbsp;{item.social}:{' '}
          <a href={item.href} target="_blank" rel="noopener">
            {item.link}
          </a>
          ;
        </p>
      ))}
      <p className={styles.line}>&#125;</p>
    </div>
  );
};

export default ContactCode;
