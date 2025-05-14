import { useState } from 'react';
import { DollarSignIcon } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import Select from 'react-select';

interface Budget {
  year: string;
  allocated: number;
  used: number;
}

interface Request {
  id: number;
  item: string;
  type: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

interface Resource {
  id: number;
  name: string;
  type: string;
  quantity: number;
  location: string;
}

export function DepartmentBudgetResources() {
  const [budget] = useState<Budget>({
    year: '2023-2024',
    allocated: 500000,
    used: 300000,
  });

  const [requests, setRequests] = useState<Request[]>([]);
  const [newRequest, setNewRequest] = useState({ item: '', type: '' });

  const [resources] = useState<Resource[]>([
    { id: 1, name: 'Projector', type: 'Equipment', quantity: 5, location: 'Room 101' },
    { id: 2, name: 'Chemistry Lab Kit', type: 'Lab Materials', quantity: 20, location: 'Chemistry Lab' },
    { id: 3, name: 'Windows Licenses', type: 'Software', quantity: 30, location: 'IT Department' },
  ]);

  const handleRaiseRequest = () => {
    const newId = requests.length + 1;
    setRequests([...requests, { id: newId, item: newRequest.item, type: newRequest.type, status: 'Pending' }]);
    setNewRequest({ item: '', type: '' });
  };

  return (
    <div className="space-y-8 p-6">
      <PageHeader
        title="Department Budget / Resources"
        subtitle="Manage budget allocations and resource requests"
        icon={DollarSignIcon}
      />

      <div className="bg-white shadow-lg rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">View Budget</h3>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Academic Year: {budget.year}</p>
          <p className="text-sm text-gray-600">Allocated Budget: ${budget.allocated.toLocaleString()}</p>
          <p className="text-sm text-gray-600">Used Budget: ${budget.used.toLocaleString()}</p>
          <p className="text-sm text-gray-600">Remaining Budget: ${(budget.allocated - budget.used).toLocaleString()}</p>
        </Card>
      </div>

      <div className="bg-white shadow-lg rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Raise Requests</h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Item Name"
            value={newRequest.item}
            onChange={(e) => setNewRequest({ ...newRequest, item: e.target.value })}
            className="border rounded-lg p-2 w-full"
          />
          <Select
            options={[
              { value: 'Equipment', label: 'Equipment' },
              { value: 'Lab Materials', label: 'Lab Materials' },
              { value: 'Events', label: 'Events' },
            ]}
            value={newRequest.type ? { value: newRequest.type, label: newRequest.type } : null}
            onChange={(option) => setNewRequest({ ...newRequest, type: option?.value || '' })}
            className="mb-4"
            placeholder="Select Request Type"
          />
          <button
            onClick={handleRaiseRequest}
            className="bg-blue-500 text-white rounded-lg p-2"
          >
            Raise Request
          </button>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Track Requests</h3>
        <div className="space-y-4">
          {requests.length > 0 ? (
            requests.map((request) => (
              <Card key={request.id} className="flex justify-between p-4">
                <div>
                  <h4 className="font-medium text-gray-900">{request.item}</h4>
                  <p className="text-sm text-gray-600">Type: {request.type} • Status: {request.status}</p>
                </div>
              </Card>
            ))
          ) : (
            <p className="text-gray-500">No requests raised yet.</p>
          )}
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resource Inventory</h3>
        <div className="space-y-4">
          {resources.length > 0 ? (
            resources.map((resource) => (
              <Card key={resource.id} className="flex justify-between p-4">
                <div>
                  <h4 className="font-medium text-gray-900">{resource.name}</h4>
                  <p className="text-sm text-gray-600">Type: {resource.type} • Quantity: {resource.quantity} • Location: {resource.location}</p>
                </div>
              </Card>
            ))
          ) : (
            <p className="text-gray-500">No resources available.</p>
          )}
        </div>
      </div>
    </div>
  );
}