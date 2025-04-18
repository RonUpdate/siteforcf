export const metadata = {
  title: "Privacy Policy - Product Showcase",
  description: "Our privacy policy and data practices",
}

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

      <div className="prose max-w-none">
        <p>Last updated: April 18, 2023</p>

        <h2>Introduction</h2>
        <p>
          Welcome to Product Showcase. We respect your privacy and are committed to protecting your personal data. This
          privacy policy will inform you about how we look after your personal data when you visit our website and tell
          you about your privacy rights and how the law protects you.
        </p>

        <h2>The Data We Collect About You</h2>
        <p>
          Personal data, or personal information, means any information about an individual from which that person can
          be identified. We may collect, use, store and transfer different kinds of personal data about you which we
          have grouped together as follows:
        </p>
        <ul>
          <li>Identity Data includes first name, last name, username or similar identifier.</li>
          <li>Contact Data includes email address.</li>
          <li>
            Technical Data includes internet protocol (IP) address, browser type and version, time zone setting and
            location, browser plug-in types and versions, operating system and platform, and other technology on the
            devices you use to access this website.
          </li>
          <li>Usage Data includes information about how you use our website and services.</li>
        </ul>

        <h2>How We Use Your Personal Data</h2>
        <p>
          We will only use your personal data when the law allows us to. Most commonly, we will use your personal data
          in the following circumstances:
        </p>
        <ul>
          <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
          <li>
            Where it is necessary for our legitimate interests (or those of a third party) and your interests and
            fundamental rights do not override those interests.
          </li>
          <li>Where we need to comply with a legal obligation.</li>
        </ul>

        <h2>Data Security</h2>
        <p>
          We have put in place appropriate security measures to prevent your personal data from being accidentally lost,
          used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal
          data to those employees, agents, contractors and other third parties who have a business need to know.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have any questions about this privacy policy or our privacy practices, please contact us at:
          privacy@example.com
        </p>
      </div>
    </div>
  )
}
