"use client";
import React, { useState } from 'react';
import { Plus, Trash2, Download } from 'lucide-react';

const CourseDetailsForm = () => {
  const [courseDetails, setCourseDetails] = useState({
    courseName: '',
    duration: '',
    totalFee: '',
    installments: [{ amount: '', dueDate: '' }]
  });

  const durationOptions = [
    "3 months", "4 months", "5 months", "6 months",
    "7 months", "8 months", "9 months", "10 months",
    "11 months", "12 months", "1 year"
  ];

  const addInstallment = () => {
    setCourseDetails({
      ...courseDetails,
      installments: [...courseDetails.installments, { amount: '', dueDate: '' }]
    });
  };

  const removeInstallment = (index) => {
    const newInstallments = courseDetails.installments.filter((_, i) => i !== index);
    setCourseDetails({
      ...courseDetails,
      installments: newInstallments
    });
  };

  const handleInstallmentChange = (index, field, value) => {
    const newInstallments = courseDetails.installments.map((installment, i) => {
      if (i === index) {
        return { ...installment, [field]: value };
      }
      return installment;
    });
    setCourseDetails({
      ...courseDetails,
      installments: newInstallments
    });
  };

  const generatePDF = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Course Details</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
              max-width: 800px;
              margin: 0 auto;
              color: #333;
            }
            .header {
              text-align: center;
              margin-bottom: 40px;
              padding-bottom: 20px;
              border-bottom: 2px solid #1a365d;
            }
            .company-logo {
            
              height: 60px;
              background-color: #121315;
              margin: 0 auto 20px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
            }
            .company-name {
              font-size: 24px;
              color: #1a365d;
              margin-bottom: 10px;
            }
            .document-title {
              font-size: 28px;
              color: #1a365d;
              margin-bottom: 30px;
              text-transform:uppercase;
            }
            .details-section {
              background-color: #f8fafc;
              padding: 25px;
              border-radius: 8px;
              margin-bottom: 30px;
            }
            .details-title {
              font-size: 20px;
              color: #1a365d;
              margin-bottom: 15px;
              text-transform:uppercase;
            }
            .detail-row {
              display: flex;
              margin-bottom: 15px;
              border-bottom: 1px solid #e2e8f0;
              padding-bottom: 10px;
            }
            .detail-label {
              font-weight: bold;
              width: 150px;
              color: #475569;
            }
            .detail-value {
              flex: 1;
            }
            .installments-section {
              margin-top: 30px;
            }
            .installment-item {
              background-color: #f8fafc;
              padding: 15px;
              margin-bottom: 15px;
              border-radius: 8px;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              color: #64748b;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-logo">
              <img src="https://www.sysdevcode.com/images/logo1.png" alt="" style="width: 35px;">
            </div>
            <div class="company-name">Sysdevcode Technologies private limited</div>
            <h1 class="document-title">Course Registration Details</h1>
          </div>

          <div class="details-section">
            <h2 class="details-title">Course Information</h2>
            <div class="detail-row">
              <div class="detail-label">Course Name:</div>
              <div class="detail-value">${courseDetails.courseName}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Duration:</div>
              <div class="detail-value">${courseDetails.duration}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Total Fee:</div>
              <div class="detail-value">₹${courseDetails.totalFee}</div>
            </div>
          </div>

          <div class="installments-section">
            <h2 class="details-title">Installment Schedule</h2>
            ${courseDetails.installments.map((inst, index) => `
              <div class="installment-item">
                <div class="detail-row">
                  <div class="detail-label">Installment ${index + 1}</div>
                  <div class="detail-value">
                    Amount: ₹${inst.amount}<br>
                    Due Date: ${inst.dueDate}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>

          <div class="footer">
            <p>Thank you for choosing sysdevcode</p>
            <p>Contact: +91 7510991147 | Email: info@sysdevcode.com</p>
            <p>Address: SYSDEVCODE ACADEMY , 1st Floor Lotus Building, Akg Vayanasala Road ,
Near Holydayinn Vytila Bypass, Kochi</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg text-black">
      <h1 className="text-2xl font-bold mb-6 uppercase">Course Details Form</h1>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Course Name</label>
          <input
            type="text"
            value={courseDetails.courseName}
            onChange={(e) => setCourseDetails({...courseDetails, courseName: e.target.value})}
            className="w-full p-2 border rounded-md"
            placeholder="Enter course name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Duration</label>
          <select
            value={courseDetails.duration}
            onChange={(e) => setCourseDetails({...courseDetails, duration: e.target.value})}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Select Duration</option>
            {durationOptions.map((duration) => (
              <option key={duration} value={duration}>{duration}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Total Fee</label>
          <input
            type="number"
            value={courseDetails.totalFee}
            onChange={(e) => setCourseDetails({...courseDetails, totalFee: e.target.value})}
            className="w-full p-2 border rounded-md"
            placeholder="Enter total fee"
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium">Installment Options</label>
            <button
              onClick={addInstallment}
              className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              <Plus className="w-4 h-4" /> Add Installment
            </button>
          </div>

          {courseDetails.installments.map((installment, index) => (
            <div key={index} className="flex gap-4 items-start p-4 border rounded-md">
              <div className="flex-1 space-y-2">
                <input
                  type="number"
                  value={installment.amount}
                  onChange={(e) => handleInstallmentChange(index, 'amount', e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="Amount"
                />
                <input
                  type="date"
                  value={installment.dueDate}
                  onChange={(e) => handleInstallmentChange(index, 'dueDate', e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <button
                onClick={() => removeInstallment(index)}
                className="p-2 text-red-500 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={generatePDF}
          className="w-full flex items-center justify-center gap-2 p-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          <Download className="w-4 h-4" /> Download PDF
        </button>
      </div>
    </div>
  );
};

export default CourseDetailsForm;
