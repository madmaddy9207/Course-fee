"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Download, Edit2, Check, X } from 'lucide-react';

const CourseDetailsForm = () => {
  const [courseDetails, setCourseDetails] = useState({
    studentName: '',
    courseName: '',
    duration: '',
    totalFee: '',
    registrationFee: '',
    installments: []
  });

  const [editingIndex, setEditingIndex] = useState(-1);
  const [editAmount, setEditAmount] = useState('');

  const durationOptions = [
    "3 months", "4 months", "5 months", "6 months",
    "7 months", "8 months", "9 months", "10 months",
    "11 months", "12 months", "1 year"
  ];

  // Calculate installments when duration or fees change
  useEffect(() => {
    if (courseDetails.duration && courseDetails.totalFee && courseDetails.registrationFee) {
      generateInstallments();
    }
  }, [courseDetails.duration, courseDetails.totalFee, courseDetails.registrationFee]);

  const generateInstallments = () => {
    const totalFee = parseFloat(courseDetails.totalFee);
    const registrationFee = parseFloat(courseDetails.registrationFee);
    
    if (isNaN(totalFee) || isNaN(registrationFee)) return;
    
    // Extract number of months from duration
    let months = 0;
    if (courseDetails.duration === "1 year") {
      months = 12;
    } else {
      months = parseInt(courseDetails.duration.split(" ")[0]);
    }
    
    if (months <= 0) return;
    
    // Calculate equal installment amount (without registration fee)
    const installmentAmount = totalFee / months;
    
    // Create installment objects
    const newInstallments = [];
    
    for (let i = 0; i < months; i++) {
      // Calculate due date (current date + i months)
      const dueDate = new Date();
      dueDate.setMonth(dueDate.getMonth() + i);
      const formattedDate = dueDate.toISOString().split('T')[0];
      
      if (i === 0) {
        // First installment is (installmentAmount - registrationFee)
        const firstInstallment = installmentAmount - registrationFee;
        newInstallments.push({
          amount: firstInstallment.toFixed(2),
          dueDate: formattedDate,
          isFirstMonth: true
        });
      } else {
        newInstallments.push({
          amount: installmentAmount.toFixed(2),
          dueDate: formattedDate,
          isFirstMonth: false
        });
      }
    }
    
    setCourseDetails(prev => ({
      ...prev,
      installments: newInstallments
    }));
  };

  const addInstallment = () => {
    const dueDate = new Date();
    if (courseDetails.installments.length > 0) {
      const lastDueDate = new Date(courseDetails.installments[courseDetails.installments.length - 1].dueDate);
      dueDate.setMonth(lastDueDate.getMonth() + 1);
    }
    
    setCourseDetails({
      ...courseDetails,
      installments: [...courseDetails.installments, { 
        amount: '0', 
        dueDate: dueDate.toISOString().split('T')[0],
        isFirstMonth: false
      }]
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

  const startEditing = (index) => {
    setEditingIndex(index);
    setEditAmount(courseDetails.installments[index].amount);
  };

  const cancelEditing = () => {
    setEditingIndex(-1);
    setEditAmount('');
  };

  const saveEditing = (index) => {
    handleInstallmentChange(index, 'amount', editAmount);
    setEditingIndex(-1);
    setEditAmount('');
  };

  const generatePDF = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Course Details</title>
          <style>
            body {
              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
            }
            .container {
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
              background-color: #fff;
            }
            .header {
              text-align: center;
              padding: 20px 0;
              border-bottom: 2px solid #333;
            }
            .logo {
              width: 60px;
              margin-bottom: 10px;
            }
            .company-name {
              font-size: 24px;
              font-weight: bold;
              color: #333;
            }
            .document-title {
              font-size: 28px;
              margin-top: 10px;
              color: #1a365d;
            }
            .section {
              margin-top: 30px;
            }
            .section-title {
              font-size: 20px;
              font-weight: bold;
              color: #1a365d;
              border-bottom: 1px solid #ccc;
              padding-bottom: 5px;
              margin-bottom: 15px;
            }
            .details-table {
              width: 100%;
              border-collapse: collapse;
            }
            .details-table th, .details-table td {
              text-align: left;
              padding: 8px;
            }
            .details-table th {
              background-color: #f8fafc;
              color: #1a365d;
            }
            .details-table td {
              border-bottom: 1px solid #e2e8f0;
            }
            .installment-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
            }
            .installment-table th, .installment-table td {
              padding: 8px;
              border: 1px solid #ccc;
              text-align: center;
            }
            .footer {
              text-align: center;
              font-size: 14px;
              color: #64748b;
              margin-top: 30px;
              border-top: 1px solid #ccc;
              padding-top: 10px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="https://www.sysdevcode.com/images/logo1.png" alt="Logo" class="logo" />
              <div class="company-name">Sysdevcode Technologies Private Limited</div>
              <div class="document-title">Course Registration Details</div>
            </div>
            <div class="section">
              <div class="section-title">Student Information</div>
              <table class="details-table">
                <tr>
                  <th>Student Name</th>
                  <td>${courseDetails.studentName}</td>
                </tr>
              </table>
            </div>
            <div class="section">
              <div class="section-title">Course Information</div>
              <table class="details-table">
                <tr>
                  <th>Course Name</th>
                  <td>${courseDetails.courseName}</td>
                </tr>
                <tr>
                  <th>Duration</th>
                  <td>${courseDetails.duration}</td>
                </tr>
                <tr>
                  <th>Total Fee</th>
                  <td>₹${courseDetails.totalFee}</td>
                </tr>
                <tr>
                  <th>Registration Fee</th>
                  <td>₹${courseDetails.registrationFee}</td>
                </tr>
              </table>
            </div>
            <div class="section">
              <div class="section-title">Installment Schedule</div>
              <table class="installment-table">
                <thead>
                  <tr>
                    <th>Installment #</th>
                    <th>Amount (₹)</th>
                    <th>Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  ${courseDetails.installments.map((inst, index) => `
                    <tr>
                      <td>${index + 1}</td>
                      <td>${inst.amount} ${inst.isFirstMonth ? '(After Reg. Fee)' : ''}</td>
                      <td>${inst.dueDate}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
            <div class="footer">
              <p>Thank you for choosing Sysdevcode Technologies</p>
              <p>Contact: +91 7510991147 | Email: info@sysdevcode.com</p>
              <p>Address: SYSDEVCODE ACADEMY, 1st Floor Lotus Building, Akg Vayanasala Road, Near Holiday Inn Vytila Bypass, Kochi</p>
            </div>
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
          <label className="block text-sm font-medium mb-1">Student Name</label>
          <input
            type="text"
            value={courseDetails.studentName}
            onChange={(e) => setCourseDetails({...courseDetails, studentName: e.target.value})}
            className="w-full p-2 border rounded-md"
            placeholder="Enter student name"
          />
        </div>
        
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

        <div className="grid grid-cols-2 gap-4">
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
          
          <div>
            <label className="block text-sm font-medium mb-1">Registration Fee</label>
            <input
              type="number"
              value={courseDetails.registrationFee}
              onChange={(e) => setCourseDetails({...courseDetails, registrationFee: e.target.value})}
              className="w-full p-2 border rounded-md"
              placeholder="Enter registration fee"
            />
          </div>
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
                <div className="flex items-center gap-2">
                  {editingIndex === index ? (
                    <>
                      <input
                        type="number"
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value)}
                        className="w-full p-2 border rounded-md"
                        placeholder="Amount"
                      />
                      <button
                        onClick={() => saveEditing(index)}
                        className="p-2 text-green-500 hover:text-green-600"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="p-2 text-red-500 hover:text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="flex-1 p-2 border rounded-md">
                        ₹{installment.amount}
                        {installment.isFirstMonth && (
                          <span className="text-xs text-gray-500 ml-2">
                            (After Registration Fee)
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => startEditing(index)}
                        className="p-2 text-blue-500 hover:text-blue-600"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
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
