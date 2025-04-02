import React, { useState } from "react";
import { PlusCircle, MinusCircle } from "lucide-react";

const Help = () => {
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    section1: true,
    section2: false,
    section3: false,
    section4: false,
    section5: false,
    section6: false,
    section7: false,
    section8: false,
    section9: false,
    section10: false,
    section11: false,
    section12: false,
  });

  const toggleSection = (sectionId: string) => {
    setExpandedSections({
      ...expandedSections,
      [sectionId]: !expandedSections[sectionId],
    });
  };
  const faqSections = [
    {
      title: "GENERAL FAQS",
      description:
        "Welcome to the CICSS (Centralized Integrated Class Scheduler System)! This guide provides answers to common questions and helps you navigate the platform efficiently.",
      questions: [
        {
          id: "section1",
          question:
            "What is the Centralized Integrated Class Scheduler System (CICSS)?",
          answer:
            "CICSS is an automated scheduling system designed for the College of Information and Computing Sciences. It helps generate and manage class schedules while considering constraints such as room availability, faculty schedules, and general education classes.",
        },
        {
          id: "section2",
          question:
            "Who can use the Centralized Integrated Class Scheduler System?",
          answer:
            "The system is accessible to three types of users: Department Chairs – Manage and approve class schedules. Teaching Academic Staff – View schedules and provide feedback. Students – View schedules and report issues.",
        },
        {
          id: "section3",
          question: "What personal information does the system collect?",
          answer:
            "The system only collects email addresses to identify user roles (student, teaching academic staff, or department chair). No other personal data is required.",
        },
      ],
    },
    {
      title: "FAQS FOR TEACHING ACADEMIC STAFF",
      description: "",
      questions: [
        {
          id: "section4",
          question: "How can I view my class schedule?",
          answer:
            "1. Log in using your registered email.\n2. Navigate to the View Schedule section.\n3. Select your preferred view:\n   • By Section – View all class schedules in a specific section.\n   • By Room – See schedules based on assigned rooms.\n   • By Professor – Check schedules by professor.",
        },
        {
          id: "section5",
          question: "How do I rate my assigned schedule?",
          answer:
            "1. Click the Rate Schedule button.\n2. Select your name to review the corresponding schedule.\n3. Confirm that you have selected the correct schedule.\n4. Provide feedback using the star rating system.\n5. Submit your feedback.",
        },
        {
          id: "section6",
          question: "Can I request schedule adjustments?",
          answer:
            "Once schedules are deployed to teaching academic staff and students, they cannot be changed until the next semester. Please coordinate with the department chair if adjustments are needed.",
        },
      ],
    },
    {
      title: "FAQS FOR STUDENTS",
      description: "",
      questions: [
        {
          id: "section7",
          question: "How do I check my class schedule?",
          answer:
            "1. Log in with your registered email.\n2. Click on View Schedule.\n3. Your schedule will be displayed, including other sections and room assignments.",
        },
        {
          id: "section8",
          question: "Can I report scheduling conflicts?",
          answer:
            "Yes. Students can report conflicts such as overlapping classes or incorrect assignments via the Report Issue button in the View Schedule section.",
        },
        {
          id: "section9",
          question: "How do I provide feedback on my schedule?",
          answer:
            "1. Go to Schedule Rating.\n2. Select the class schedule you want to review.\n3. Provide a rating and comments (if applicable).\n4. Click Submit.",
        },
      ],
    },
    {
      title: "TROUBLESHOOT & SUPPORT",
      description: "",
      questions: [
        {
          id: "section10",
          question: "I can't log in. What should I do?",
          answer:
            "1. Ensure you are using the correct email address.\n2. Contact the department chair if issues persist.",
        },
        {
          id: "section11",
          question: "My schedule is incorrect or missing. How do I fix this?",
          answer:
            "If your schedule is incorrect or missing, contact your department chair for assistance.",
        },
        {
          id: "section12",
          question: "Who do I contact for additional support?",
          answer:
            "For technical issues, reach out to your department chair:\n• Computer Science: Asst. Prof. Cherry Rose R. Estabillo, MS Applied Math – crestabillo@ust.edu.ph\n• Information Systems: Asst. Prof. Janette E. Sideño, PhD TM – jesideno@ust.edu.ph\n• Information Technology: Asst. Prof. Leonid C. Lintag, MIT – lclintag@ust.edu.ph",
        },
      ],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      <h1 className="text-3xl font-Helvetica-Neue-Heavy font-bold text-center mb-8 text-primary">
        CICSS Help Center
      </h1>

      {faqSections.map((section, index) => (
        <div key={index} className="mb-12">
          <div className="flex flex-col md:flex-row gap-8 mb-6">
            {/* Section Header */}
            <div className="md:w-1/4">
              <h3 className="text-xl font-bold text-primary">
                {section.title}
              </h3>
              {section.description && (
                <p className="text-gray-600 mt-2">{section.description}</p>
              )}
            </div>

            {/* Questions */}
            <div className="md:w-3/4">
              {section.questions.map((item) => (
                <div
                  key={item.id}
                  className="mb-6 border-b border-primary pb-4"
                >
                  <div
                    className="flex items-center justify-between cursor-pointer group"
                    onClick={() => toggleSection(item.id)}
                  >
                    <h2 className="font-medium text-lg pr-4 text-primary group-hover:text-blue-600">
                      {item.question}
                    </h2>
                    {expandedSections[item.id] ? (
                      <MinusCircle className="text-primary flex-shrink-0" />
                    ) : (
                      <PlusCircle className="text-primary  flex-shrink-0" />
                    )}
                  </div>

                  {expandedSections[item.id] && (
                    <div className="mt-3 text-gray-700 whitespace-pre-line">
                      {item.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      <div className="text-center mt-8 text-gray-600 text-sm">
        <p>Need More Help?</p>
        <p>For further assistance, please contact your department chair.</p>
      </div>
    </div>
  );
};

export default Help;
