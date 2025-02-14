import React, { useEffect } from "react"
import styled from "styled-components"
import ErrorReportingBoundry from "../components/ErrorReportingBoundry"
import SEO from "../components/SEO"
import { useMetaData } from "../context/MetaData"
import Layout from "../components/Layout"

const Section = styled.section`
  max-width: 900px;
  margin: 0 auto;
  width: 80vw;
`

const PrivacyPolicyPage = () => {
  const MetaData = useMetaData()

  /**
   * set the title
   */
  if (MetaData && MetaData.safeSetTitle) {
    MetaData.safeSetTitle("Privacy Policy")
  }

  return (
    <Layout>
      <Section id="privacy">
        <SEO
          description="Learn about what information we gather, how we use, and who we share it with."
          title="Privacy Policy | Voice Your Stance"
        />
        <ErrorReportingBoundry>
          <h1>Privacy Policy</h1>
          <p>
            <em>Last updated May 30, 2020</em>
          </p>
          <div>
            <p>
              Thank you for choosing to be part of our community at Voice Your Stance (&ldquo;<em>Company</em>
              &rdquo;, &ldquo;<em>we</em>&rdquo;, &ldquo;<em>us</em>&rdquo;, or &ldquo;
              <em>our</em>&rdquo;). We are committed to protecting your personal information and your right to privacy.
              If you have any questions or concerns about our policy, or our practices with regards to your personal
              information, please contact us at admin@voiceyourstance.com.
            </p>
            <p>
              When you visit our website voiceyourstance.com, and use our services, you trust us with your personal
              information. We take your privacy very seriously. In this privacy notice, we describe our privacy policy.
              We seek to explain to you in the clearest way possible what information we collect, how we use it and what
              rights you have in relation to it. We hope you take some time to read through it carefully, as it is
              important. If there are any terms in this privacy policy that you do not agree with, please discontinue
              use of our Sites and our services.
            </p>
            <p>
              This privacy policy applies to all information collected through our website (such as
              voiceyourstance.com), and/or any related services, sales, marketing or events (we refer to them
              collectively in this privacy policy as the "<em>Sites</em>").
            </p>
            <p>
              <em>
                Please read this privacy policy carefully as it will help you make informed decisions about sharing your
                personal information with us.
              </em>
            </p>
            <p>
              <em>TABLE OF CONTENTS</em>
            </p>

            <p>
              <a href="privacy-policy/#infocollect">1. WHAT INFORMATION DO WE COLLECT?</a>
            </p>
            <p>
              <a href="privacy-policy/#infouse">2. HOW DO WE USE YOUR INFORMATION?</a>
            </p>
            <p>
              <a href="privacy-policy/#infoshare">3. WILL YOUR INFORMATION BE SHARED WITH ANYONE?</a>
            </p>
            <p>
              <a href="privacy-policy/#whoshare">4. WHO WILL YOUR INFORMATION BE SHARED WITH?</a>
            </p>
            <p>
              <a href="privacy-policy/#cookies">5. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?</a>
            </p>
            <p>
              <a href="privacy-policy/#inforetain">6. HOW LONG DO WE KEEP YOUR INFORMATION?</a>
            </p>
            <p>
              <a href="privacy-policy/#infosafe">7. HOW DO WE KEEP YOUR INFORMATION SAFE?</a>
            </p>
            <p>
              <a href="privacy-policy/#infominors">8. DO WE COLLECT INFORMATION FROM MINORS?</a>
            </p>
            <p>
              <a href="privacy-policy/#privacyrights">9. WHAT ARE YOUR PRIVACY RIGHTS?</a>
            </p>
            <p>
              <a href="privacy-policy/#dnt">10. CONTROLS FOR DO-NOT-TRACK FEATURES</a>
            </p>
            <p>
              <a href="privacy-policy/#caresidents">11. DO CALIFORNIA RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?</a>
            </p>
            <p>
              <a href="privacy-policy/#policyupdates">12. DO WE MAKE UPDATES TO THIS POLICY?</a>
            </p>
            <p>
              <a href="privacy-policy/#contact">13. HOW CAN YOU CONTACT US ABOUT THIS POLICY?</a>
            </p>

            <p id="infocollect">
              <em>1. WHAT INFORMATION DO WE COLLECT?</em>
            </p>
            <p>
              <em>Personal information you disclose to us</em>
            </p>
            <p>
              <em>
                <em>In Short:</em>{" "}
              </em>
              <em>
                We collect personal information that you provide to us such as name, address, contact information,
                passwords and security data, and payment information.
              </em>{" "}
            </p>
            <p>
              We collect personal information that you voluntarily provide to us when registering at the Sites
              expressing an interest in obtaining information about us or our products and services, when participating
              in activities on the Sites or otherwise contacting us.
            </p>
            <p>
              The personal information that we collect depends on the context of your interactions with us and the
              Sites, the choices you make and the products and features you use. The personal information we collect can
              include the following:
            </p>
            <p>
              <em>Name and Contact Data.</em> We collect your first and last name, email address, postal address, phone
              number, and other similar contact data.
            </p>
            <p>
              <em>Credentials.</em>&nbsp;We collect passwords, password hints, and similar security information used for
              authentication and account access.
            </p>
            <p>
              <em>Payment Data.</em>&nbsp;We collect data necessary to process your payment if you make purchases, such
              as your payment instrument number (such as a credit card number), and the security code associated with
              your payment instrument. All payment data is stored by our payment processor and you should review its
              privacy policies and contact the payment processor directly to respond to your questions.{" "}
            </p>
            <p>
              All personal information that you provide to us must be true, complete and accurate, and you must notify
              us of any changes to such personal information.{" "}
            </p>
            <p>
              <em>Information automatically collected</em>
            </p>
            <p>
              <em>
                <em>In Short:</em>&nbsp;
              </em>
              <em>
                Some information &ndash; such as IP address and/or browser and device characteristics &ndash; is
                collected automatically when you visit our Sites.
              </em>
            </p>
            <p>
              We automatically collect certain information when you visit, use or navigate the Sites. This information
              does not reveal your specific identity (like your name or contact information) but may include device and
              usage information, such as your IP address, browser and device characteristics, operating system, language
              preferences, referring URLs, device name, country, location, information about how and when you use our
              Sites and other technical information. This information is primarily needed to maintain the security and
              operation of our Sites, and for our internal analytics and reporting purposes.
            </p>
            <p>Like many businesses, we also collect information through cookies and similar technologies.</p>
            <p>
              <em>Information collected from other sources</em>
            </p>
            <p>
              <em>
                <em>In Short:&nbsp;</em>
              </em>
              <em>We may collect limited data from public databases, marketing partners, and other outside sources.</em>
            </p>
            <p>
              We may obtain information about you from other sources, such as public databases, joint marketing
              partners, as well as from other third parties. Examples of the information we receive from other sources
              include: social media profile information; marketing leads and search results and links, including paid
              listings (such as sponsored links).
            </p>
            <p id="infouse">
              <em>2. HOW DO WE USE YOUR INFORMATION?</em>
            </p>
            <p>
              <em>
                <em>In Short:&nbsp;</em>&nbsp;
              </em>
              <em>
                We process your information for purposes based on legitimate business interests, the fulfillment of our
                contract with you, compliance with our legal obligations, and/or your consent.
              </em>{" "}
            </p>
            <p>
              We use personal information collected via our Sites for a variety of business purposes described below. We
              process your personal information for these purposes in reliance on our legitimate business interests, in
              order to enter into or perform a contract with you, with your consent, and/or for compliance with our
              legal obligations. We indicate the specific processing grounds we rely on next to each purpose listed
              below.
            </p>
            <p>We use the information we collect or receive: </p>
            <ul>
              <li>
                <em>To facilitate account creation and logon process.</em>&nbsp;If you choose to link your account with
                us to a third party account *(such as your Google or Facebook account), we use the information you
                allowed us to collect from those third parties to facilitate account creation and logon process. <br />
                <br />
              </li>
              <li>
                <em>To send you marketing and promotional communications.</em>&nbsp;We and/or our third party marketing
                partners may use the personal information you send to us for our marketing purposes, if this is in
                accordance with your marketing preferences. You can opt-out of our marketing emails at any time (see the
                " <a href="privacy-policy/#privacyrights">WHAT ARE YOUR PRIVACY RIGHTS</a> " below). <br />
                <br />
              </li>
              <li>
                <em>To send administrative information to you.&nbsp;</em>We may use your personal information to send
                you product, service and new feature information and/or information about changes to our terms,
                conditions, and policies. <br />
                <br />
              </li>
              <li>
                <em>Fulfill and manage your orders.</em>&nbsp;We may use your information to fulfill and manage your
                orders, payments, returns, and exchanges made through the Sites.{" "}
              </li>
            </ul>
            <p id="infoshare">
              <em>3. WILL YOUR INFORMATION BE SHARED WITH ANYONE?</em>
            </p>
            <p>
              <em>
                <em>In Short:</em>&nbsp;
              </em>
              <em>
                We only share information with your consent, to comply with laws, to protect your rights, or to fulfill
                business obligations.
              </em>{" "}
            </p>
            <p>We may process or share data based on the following legal basis:</p>
            <ul>
              <li>
                <em>Consent:</em> We may process your data if you have given us specific consent to use your personal
                information in a specific purpose.
                <br />
                <br />
              </li>
              <li>
                <em>Legitimate Interests:</em> We may process your data when it is reasonably necessary to achieve our
                legitimate business interests.
                <br />
                <br />
              </li>
              <li>
                <em>Performance of a Contract:&nbsp;</em>Where we have entered into a contract with you, we may process
                your personal information to fulfill the terms of our contract.
                <br />
                <br />
              </li>
              <li>
                <em>Legal Obligations:</em> We may disclose your information where we are legally required to do so in
                order to comply with applicable law, governmental requests, a judicial proceeding, court order, or legal
                process, such as in response to a court order or a subpoena (including in response to public authorities
                to meet national security or law enforcement requirements).
                <br />
                <br />
              </li>
              <li>
                <em>Vital Interests:</em> We may disclose your information where we believe it is necessary to
                investigate, prevent, or take action regarding potential violations of our policies, suspected fraud,
                situations involving potential threats to the safety of any person and illegal activities, or as
                evidence in litigation in which we are involved.
              </li>
            </ul>
            <p>
              More specifically, we may need to process your data or share your personal information in the following
              situations:{" "}
            </p>
            <ul>
              <li>
                <em>Vendors, Consultants and Other Third-Party Service Providers.</em>&nbsp;We may share your data with
                third party vendors, service providers, contractors or agents who perform services for us or on our
                behalf and require access to such information to do that work. Examples include: payment processing,
                data analysis, email delivery, hosting services, customer service and marketing efforts. We may allow
                selected third parties to use tracking technology on the Sites, which will enable them to collect data
                about how you interact with the Sites over time. This information may be used to, among other things,
                analyze and track data, determine the popularity of certain content and better understand online
                activity. Unless described in this Policy, we do not share, sell, rent or trade any of your information
                with third parties for their promotional purposes. <br />
                <br />
              </li>
              <li>
                <em>Business Transfers.</em>&nbsp;We may share or transfer your information in connection with, or
                during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a
                portion of our business to another company.{" "}
              </li>
            </ul>
            <p id="whoshare">
              <em>4. WHO WILL YOUR INFORMATION BE SHARED WITH?</em>
            </p>
            <div>
              <em>
                <em>In Short:</em>&nbsp;
              </em>
              <em>We only share information with the following third parties.</em>{" "}
            </div>
            <div> </div>
            <div>
              We only share and disclose your information with the following third parties. We have categorized each
              party so that you may be easily understand the purpose of our data collection and processing practices. If
              we have processed your data based on your consent and you wish to revoke your consent, please contact us.
            </div>
            <ul>
              <li>
                <em>Web and Mobile Analytics</em>
                <br />
                Google Analytics
              </li>
            </ul>
            <p id="cookies">
              <em>5. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?</em>
            </p>
            <p>
              <em>
                <em>In Short:</em>&nbsp;
              </em>
              <em>We may use cookies and other tracking technologies to collect and store your information.</em>{" "}
            </p>
            <p>
              We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store
              information. Specific information about how we use such technologies and how you can refuse certain
              cookies is set out in our Cookie Policy.{" "}
            </p>
            <p id="inforetain">
              <em>6. HOW LONG DO WE KEEP YOUR INFORMATION?</em>
            </p>
            <p>
              <em>
                <em>In Short:</em>&nbsp;
              </em>
              <em>
                We keep your information for as long as necessary to fulfill the purposes outlined in this privacy
                policy unless otherwise required by law.
              </em>{" "}
            </p>
            <p>
              We will only keep your personal information for as long as it is necessary for the purposes set out in
              this privacy policy, unless a longer retention period is required or permitted by law (such as tax,
              accounting or other legal requirements). No purpose in this policy will require us keeping your personal
              information for longer than the period of time in which users have an account with us.
            </p>
            <p>
              When we have no ongoing legitimate business need to process your personal information, we will either
              delete or anonymize it, or, if this is not possible (for example, because your personal information has
              been stored in backup archives), then we will securely store your personal information and isolate it from
              any further processing until deletion is possible.
            </p>
            <p id="infosafe">
              <em>7. HOW DO WE KEEP YOUR INFORMATION SAFE? </em>
            </p>
            <p>
              <em>
                <em>In Short:</em>&nbsp;
              </em>
              <em>
                We aim to protect your personal information through a system of organizational and technical security
                measures.
              </em>{" "}
            </p>
            <p>
              We have implemented appropriate technical and organizational security measures designed to protect the
              security of any personal information we process. However, please also remember that we cannot guarantee
              that the internet itself is 100% secure. Although we will do our best to protect your personal
              information, transmission of personal information to and from our Sites is at your own risk. You should
              only access the services within a secure environment.
            </p>
            <p id="infominors">
              <em>8. DO WE COLLECT INFORMATION FROM MINORS?</em>
            </p>
            <p>
              <em>
                <em>In Short:</em>&nbsp;
              </em>
              <em>We do not knowingly collect data from or market to children under 18 years of age.</em>{" "}
            </p>
            <p>
              We do not knowingly solicit data from or market to children under 18 years of age. By using the Sites, you
              represent that you are at least 18 or that you are the parent or guardian of such a minor and consent to
              such minor dependent&rsquo;s use of the Sites. If we learn that personal information from users less than
              18 years of age has been collected, we will deactivate the account and take reasonable measures to
              promptly delete such data from our records. If you become aware of any data we have collected from
              children under age 18, please contact us at admin@voiceyourstance.com.{" "}
            </p>
            <p id="privacyrights">
              <em>9. WHAT ARE YOUR PRIVACY RIGHTS?</em>
            </p>
            <p>
              <em>
                <em>In Short:</em>&nbsp;
              </em>
              <em>You may review, change, or terminate your account at any time.</em>
            </p>
            <p>
              If you are resident in the European Economic Area and you believe we are unlawfully processing your
              personal information, you also have the right to complain to your local data protection supervisory
              authority. You can find their contact details here:&nbsp;
              <a href="http://ec.europa.eu/justice/data-protection/bodies/authorities/index_en.htm">
                http://ec.europa.eu/justice/data-protection/bodies/authorities/index_en.htm
              </a>{" "}
              <br />
            </p>
            <p>
              <em>Account Information</em>{" "}
            </p>
            <p>
              If you would at any time like to review or change the information in your account or terminate your
              account, you can:{" "}
            </p>
            <p>Log into your account settings and update your user account. </p>
            <p>Contact us using the contact information provided. </p>
            <p>
              Upon your request to terminate your account, we will deactivate or delete your account and information
              from our active databases. However, some information may be retained in our files to prevent fraud,
              troubleshoot problems, assist with any investigations, enforce our Terms of Use and/or comply with legal
              requirements.{" "}
            </p>
            <p>
              <em>
                <u>Cookies and similar technologies:</u>&nbsp;
              </em>
              Most Web browsers are set to accept cookies by default. If you prefer, you can usually choose to set your
              browser to remove cookies and to reject cookies. If you choose to remove cookies or reject cookies, this
              could affect certain features or services of our Sites. To opt-out of interest-based advertising by
              advertisers on our Sites visit{" "}
              <a href="http://www.aboutads.info/choices/">http://www.aboutads.info/choices/</a>.{" "}
            </p>
            <p>
              <em>
                <u>Opting out of email marketing:</u>&nbsp;
              </em>
              You can unsubscribe from our marketing email list at any time by clicking on the unsubscribe link in the
              emails that we send or by contacting us using the details provided below. You will then be removed from
              the marketing email list &ndash; however, we will still need to send you service-related emails that are
              necessary for the administration and use of your account. To otherwise opt-out, you may:{" "}
            </p>
            <p>Note your preferences when you register an account with the site. </p>
            <p>Access your account settings and update preferences. </p>
            <p>Contact us using the contact information provided. </p>
            <p id="dnt">
              <em>10. CONTROLS FOR DO-NOT-TRACK FEATURES</em>
            </p>
            <p>
              Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track
              (&ldquo;DNT&rdquo;) feature or setting you can activate to signal your privacy preference not to have data
              about your online browsing activities monitored and collected. No uniform technology standard for
              recognizing and implementing DNT signals has been finalized. As such, we do not currently respond to DNT
              browser signals or any other mechanism that automatically communicates your choice not to be tracked
              online. If a standard for online tracking is adopted that we must follow in the future, we will inform you
              about that practice in a revised version of this Privacy Policy.
            </p>
            <p id="caresidents">
              <em>11. DO CALIFORNIA RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?</em>
            </p>
            <p>
              <em>
                <em>In Short:</em>&nbsp;
              </em>
              <em>
                Yes, if you are a resident of California, you are granted specific rights regarding access to your
                personal information.
              </em>{" "}
            </p>
            <p>
              California Civil Code Section 1798.83, also known as the &ldquo;Shine The Light&rdquo; law, permits our
              users who are California residents to request and obtain from us, once a year and free of charge,
              information about categories of personal information (if any) we disclosed to third parties for direct
              marketing purposes and the names and addresses of all third parties with which we shared personal
              information in the immediately preceding calendar year. If you are a California resident and would like to
              make such a request, please submit your request in writing to us using the contact information provided
              below.
            </p>
            <p>
              If you are under 18 years of age, reside in California, and have a registered account with the Sites, you
              have the right to request removal of unwanted data that you publicly post on the Sites. To request removal
              of such data, please contact us using the contact information provided below, and include the email
              address associated with your account and a statement that you reside in California. We will make sure the
              data is not publicly displayed on the Sites, but please be aware that the data may not be completely or
              comprehensively removed from our systems.
            </p>
            <p id="policyupdates">
              <em>12. DO WE MAKE UPDATES TO THIS POLICY?</em>
            </p>
            <p>
              <em>
                <em>In Short:</em>&nbsp;
              </em>
              <em>Yes, we will update this policy as necessary to stay compliant with relevant laws.</em>{" "}
            </p>
            <p>
              We may update this privacy policy from time to time. The updated version will be indicated by an updated
              &ldquo;Revised&rdquo; date and the updated version will be effective as soon as it is accessible. If we
              make material changes to this privacy policy, we may notify you either by prominently posting a notice of
              such changes or by directly sending you a notification. We encourage you to review this privacy policy
              frequently to be informed of how we are protecting your information.
            </p>
            <p id="contact">
              <em>13. HOW CAN YOU CONTACT US ABOUT THIS POLICY?</em>
            </p>
            <p>
              If you have questions or comments about this policy, you may contact our Data Protection Officer (DPO), by
              email at admin@voiceyourstance.com, or by post to:
            </p>
            <div>Voice Your Stance</div>
            <div>123 fake st.,</div>
            <div>somewhere, St 00000</div>
          </div>
        </ErrorReportingBoundry>
      </Section>
    </Layout>
  )
}

export default PrivacyPolicyPage
