import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen py-10 px-4 md:px-6 lg:px-8">
      <div className="bg-[#F1FAFF] mx-auto flex flex-col items-center justify-center w-full max-w-5xl px-4 sm:px-6 md:px-8 py-8 md:py-10 lg:py-12 rounded-xl shadow-2xl border">
        <h3 className="font-Helvetica-Neue-Heavy font-extrabold text-primary text-lg sm:text-xl md:text-2xl mb-4 md:mb-7 text-center">
          TERMS AND CONDITIONS
        </h3>

        <div className="bg-[#FFFFFF] overflow-y-auto w-full h-screen md:h-96 p-3 sm:p-4 md:p-5 rounded-lg shadow-md">
          <p className="text-[#6B6B6B] font-Manrope text-sm sm:text-base">
            Last Updated: March 28, 2025
            <br />
            <br />
            Welcome to the Centralized Integrated Class Scheduler System
            (CICSS). By accessing or using this system, you agree to comply with
            and be bound by the following terms and conditions. If you do not
            agree with these terms, you should not use the system.
            <br />
            <br />
            1. Definitions "System" refers to the CICSS platform. "User" refers
            to any individual who accesses the system, including department
            chairs, teaching academic staff, and students. "Administrator"
            refers to the department chair responsible for managing the
            scheduling process. "Data" refers to information entered into the
            system, including schedules, feedback, and reports.
            <br />
            <br />
            2. User Eligibility The system is available exclusively to students,
            teaching academic staff, and department chairs of the College of
            Information and Computing Sciences. Users must use their
            university-registered email addresses to access the system.
            <br />
            <br />
            3. User Responsibilities
            <br />
            <div className="pl-2 md:pl-3">
              3.1. Account Security Users are responsible for maintaining the
              confidentiality of their login credentials. Unauthorized access or
              sharing of login details is strictly prohibited.
              <br />
              3.2. Accurate Information Users must ensure that all data entered
              into the system is accurate and up-to-date. Any intentional
              falsification of data may result in restricted access or
              disciplinary action.
              <br />
              3.3. Proper Use The system should only be used for academic
              scheduling purposes. Users must not engage in activities that
              disrupt system functionality, such as attempting to hack, alter,
              or manipulate schedules outside their role.
            </div>
            <br />
            4. Scheduling Policies
            <br />
            <div className="pl-2 md:pl-3">
              4.1. Schedule Availability Schedules are generated based on room
              availability, faculty assignments, and university policies.
              Teaching academic staff and students must check their assigned
              schedules in the system.
              <br />
              4.2. Schedule Adjustments Once deployed, schedules cannot be
              changed until the next semester unless approved by the department
              chair. Requests for schedule modifications must be submitted
              through the designated process.
              <br />
              4.3. Sending Feedback on Scheduling Issues Users may send feedback
              regarding scheduling conflicts, such as overlapping classes or
              incorrect assignments, via the Send Feedback function. The
              department chair will review and address submitted feedback at
              their discretion.
            </div>
            <br />
            5. Feedback and Ratings Teaching academic staff and students may
            provide feedback on assigned schedules through the Schedule Rating
            feature. Constructive feedback is encouraged to improve future
            scheduling processes.
            <br />
            <br />
            6. Data Privacy and Security The system collects only email
            addresses for user identification purposes. No additional personal
            data is stored or shared with third parties. System administrators
            will take necessary measures to protect data integrity and security.
            <br />
            <br />
            7. System Downtime and Maintenance Scheduled maintenance may cause
            temporary system unavailability. Users will be notified in advance
            of any planned maintenance. The university is not responsible for
            any inconvenience caused by unexpected system downtimes.
            <br />
            <br />
            8. Violations and Consequences Any violation of these terms may
            result in temporary or permanent suspension of access to the system,
            disciplinary action as per university policies, or reporting of
            severe violations to university administration.
            <br />
            <br />
            9. Limitation of Liability The university is not liable for any
            losses, damages, or inconveniences arising from system errors,
            incorrect scheduling, or misuse of the platform. Users acknowledge
            that the system is provided "as is" and may be subject to
            improvements or modifications.
            <br />
            <br />
            10. Amendments to Terms These terms and conditions may be updated
            periodically. Users will be notified of any significant changes.
            Continued use of the system after updates constitutes acceptance of
            the revised terms.
            <br />
            <br />
            11. Contact Information For any concerns or inquiries regarding
            these terms, please contact your respective department chair:
            <br />
            <div className="pl-2 md:pl-3">
              Computer Science: Asst. Prof. Cherry Rose R. Estabillo, MS Applied
              Math – crestabillo@ust.edu.ph
              <br />
              Information Systems: Asst. Prof. Janette E. Sideño, PhD TM –
              jesideno@ust.edu.ph
              <br />
              Information Technology: Asst. Prof. Leonid C. Lintag, MIT –
              lclintag@ust.edu.ph For further assistance, contact your
              department chair.
            </div>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
