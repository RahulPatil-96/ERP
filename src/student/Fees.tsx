import { DollarSign, CreditCard, Calendar, Download, Clock, AlertCircle } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';

const FEES = [
  {
    id: 1,
    type: 'Tuition Fee',
    amount: 12500,
    dueDate: '2024-03-15',
    status: 'pending',
    description: 'Spring Semester 2024',
  },
  {
    id: 2,
    type: 'Library Fee',
    amount: 200,
    dueDate: '2024-03-15',
    status: 'paid',
    description: 'Annual Library Access',
    paidOn: '2024-02-01',
  },
  {
    id: 3,
    type: 'Laboratory Fee',
    amount: 500,
    dueDate: '2024-03-15',
    status: 'pending',
    description: 'Science Lab Access',
  },
];

const PAYMENT_METHODS = [
  {
    id: 1,
    type: 'Credit Card',
    last4: '4242',
    expiry: '12/25',
    primary: true,
  },
  {
    id: 2,
    type: 'Bank Account',
    last4: '9876',
    bankName: 'National Bank',
    primary: false,
  },
];

export function Fees() {
  const totalDue = FEES.reduce((sum, fee) => 
    fee.status === 'pending' ? sum + fee.amount : sum, 0
  );

  const totalPaid = FEES.reduce((sum, fee) => 
    fee.status === 'paid' ? sum + fee.amount : sum, 0
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Fees & Payments"
        subtitle="Manage your fees, payments, and financial records"
        icon={DollarSign}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-br from-indigo-50 to-indigo-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-indigo-600 font-medium">Total Due</p>
              <p className="text-2xl font-bold text-indigo-900">${totalDue.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-white rounded-xl shadow-sm">
              <AlertCircle className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Total Paid</p>
              <p className="text-2xl font-bold text-green-900">${totalPaid.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-white rounded-xl shadow-sm">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-amber-50 to-amber-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-amber-600 font-medium">Next Due Date</p>
              <p className="text-2xl font-bold text-amber-900">Mar 15, 2024</p>
            </div>
            <div className="p-3 bg-white rounded-xl shadow-sm">
              <Calendar className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Fee Details</h2>
            <div className="space-y-4">
              {FEES.map((fee) => (
                <div
                  key={fee.id}
                  className="p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{fee.type}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      fee.status === 'paid'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {fee.status === 'paid' ? 'Paid' : 'Pending'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{fee.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <span className="font-medium text-gray-900">
                        ${fee.amount.toLocaleString()}
                      </span>
                      <span className="text-gray-500">
                        Due: {new Date(fee.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                    {fee.status === 'paid' ? (
                      <button className="flex items-center text-indigo-600 hover:text-indigo-700">
                        <Download className="w-4 h-4 mr-1" />
                        Receipt
                      </button>
                    ) : (
                      <button className="px-4 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                        Pay Now
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment History</h2>
            <div className="space-y-4">
              {[
                { date: '2024-02-01', amount: 200, description: 'Library Fee Payment' },
                { date: '2024-01-15', amount: 12500, description: 'Fall Semester Tuition' },
                { date: '2023-12-10', amount: 500, description: 'Laboratory Fee Payment' },
              ].map((payment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{payment.description}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(payment.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      ${payment.amount.toLocaleString()}
                    </p>
                    <button className="text-sm text-indigo-600 hover:text-indigo-700">
                      View Receipt
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h2>
            <div className="space-y-4">
              {PAYMENT_METHODS.map((method) => (
                <div
                  key={method.id}
                  className="p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      {method.type === 'Credit Card' ? (
                        <CreditCard className="w-5 h-5 text-gray-400" />
                      ) : (
                        <DollarSign className="w-5 h-5 text-gray-400" />
                      )}
                      <h3 className="font-medium text-gray-900">{method.type}</h3>
                    </div>
                    {method.primary && (
                      <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs">
                        Primary
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    {method.type === 'Credit Card' ? (
                      <p>Ending in {method.last4} • Expires {method.expiry}</p>
                    ) : (
                      <p>{method.bankName} •••• {method.last4}</p>
                    )}
                  </div>
                </div>
              ))}
              <button className="w-full py-2 border-2 border-dashed border-gray-200 rounded-xl text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-colors">
                + Add Payment Method
              </button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h2>
            <div className="space-y-4 text-sm">
              <p className="text-gray-600">
                Contact the finance department for any questions about your fees or payments.
              </p>
              <div className="flex items-center space-x-2 text-indigo-600">
                <Clock className="w-4 h-4" />
                <span>Mon-Fri, 9:00 AM - 5:00 PM</span>
              </div>
              <button className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Contact Support
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}