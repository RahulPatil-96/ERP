import { useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Users as UsersIcon } from 'lucide-react';
import { useAuthStore } from '../../store/authStore'; // Import the useAuthStore hook

interface Client {
  id: number;
  organizationName: string;
  address: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  numberOfUsers: number;
  registrationDate: string;
  status: string;
  price: number;
  paymentDueDate: string;
  lastPaymentDate: string;
  outstandingAmount: number;
  paymentStatus: string;
  modules: string[];
}

const Users = () => {
  const [clients, setClients] = useState<Client[]>([
    {
      id: 1,
      organizationName: 'XYZ Corporation',
      address: '123 Main St, City, Country',
      contactPerson: 'John Doe',
      contactEmail: 'johndoe@xyz.com',
      contactPhone: '+123456789',
      numberOfUsers: 150,
      registrationDate: '2022-01-15',
      status: 'Active',
      price: 5000,
      paymentDueDate: '2025-03-15',
      lastPaymentDate: '2025-01-15',
      outstandingAmount: 1000,
      paymentStatus: 'Pending',
      modules: ['Attendance', 'Quiz', 'Library', 'Grading'],
    },
    {
      id: 2,
      organizationName: 'ABC School',
      address: '456 School Rd, City, Country',
      contactPerson: 'Jane Smith',
      contactEmail: 'janesmith@abc.com',
      contactPhone: '+987654321',
      numberOfUsers: 50,
      registrationDate: '2021-08-10',
      status: 'Inactive',
      price: 2000,
      paymentDueDate: '2025-03-10',
      lastPaymentDate: '2024-08-10',
      outstandingAmount: 0,
      paymentStatus: 'Completed',
      modules: ['Attendance', 'Library'],
    },
    {
      id: 3,
      organizationName: 'Tech Solutions Ltd',
      address: '789 Tech Ave, City, Country',
      contactPerson: 'Sam Wilson',
      contactEmail: 'sam@techsolutions.com',
      contactPhone: '+1122334455',
      numberOfUsers: 200,
      registrationDate: '2023-03-01',
      status: 'Active',
      price: 7000,
      paymentDueDate: '2025-03-20',
      lastPaymentDate: '2025-02-20',
      outstandingAmount: 0,
      paymentStatus: 'Completed',
      modules: ['Quiz', 'Grading'],
    },
  ]);

  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>(''); // State for selected user ID
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [newClient, setNewClient] = useState<Client>({
    id: 0,
    organizationName: '',
    address: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    numberOfUsers: 0,
    registrationDate: '',
    status: 'Active',
    price: 0,
    paymentDueDate: '',
    lastPaymentDate: '',
    outstandingAmount: 0,
    paymentStatus: 'Pending',
    modules: [],
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const clientsPerPage = 2;

  const handleViewDetails = (client: Client) => {
    setSelectedClient(client);
    setIsModalOpen(true); // Open the modal when a client is selected
  };

  const handleDeleteClient = (clientId: number) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      setClients(clients.filter(client => client.id !== clientId));
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(event.target.value);
  };

  const handleAddClientOpen = () => {
    setIsAddClientModalOpen(true);
  };

  const closeAddClientModal = () => {
    setIsAddClientModalOpen(false);
    setNewClient({
      id: 0,
      organizationName: '',
      address: '',
      contactPerson: '',
      contactEmail: '',
      contactPhone: '',
      numberOfUsers: 0,
      registrationDate: '',
      status: 'Active',
      price: 0,
      paymentDueDate: '',
      lastPaymentDate: '',
      outstandingAmount: 0,
      paymentStatus: 'Pending',
      modules: [],
    });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewClient(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleModuleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    if (!newClient.modules.includes(value)) {
      setNewClient(prevState => ({
        ...prevState,
        modules: [...prevState.modules, value],
      }));
    }
  };

  const handleAddClientSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const newClientWithId = {
      ...newClient,
      id: Date.now(),
      registrationDate: new Date().toISOString().split('T')[0],
    };

    setClients(prevClients => [...prevClients, newClientWithId]);
    closeAddClientModal();
  };

  const filteredClients = clients
    .filter(
      (client) =>
        client.organizationName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (statusFilter === '' || client.status === statusFilter)
    )
    .slice((currentPage - 1) * clientsPerPage, currentPage * clientsPerPage);

  const handleNextPage = () => {
    if (filteredClients.length === clientsPerPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Users" 
        subtitle="Manage your clients and their information"
        icon={UsersIcon}
      />
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-xl">
        <button
          className="px-4 py-2 bg-green-500 text-white rounded-lg mb-4 hover:bg-green-600"
          onClick={handleAddClientOpen}
        >
          Add Client
        </button>

        <div className="flex justify-between mb-4">
          <input
            type="text"
            placeholder="Search by Organization..."
            value={searchTerm}
            onChange={handleSearch}
            className="px-4 py-2 border rounded-lg w-1/3"
          />
          <select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="px-4 py-2 border rounded-lg w-1/3"
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-3 px-4 text-left">Organization</th>
                <th className="py-3 px-4 text-left">Contact Person</th>
                <th className="py-3 px-4 text-left">Modules</th>
                <th className="py-3 px-4 text-left">Price</th>
                <th className="py-3 px-4 text-left">Payment Status</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr
                  key={client.id}
                  className="border-t hover:bg-gray-50 transition-all duration-300"
                >
                  <td className="py-3 px-4 cursor-pointer" onClick={() => handleViewDetails(client)}>{client.organizationName}</td>
                  <td className="py-3 px-4 cursor-pointer" onClick={() => handleViewDetails(client)}>{client.contactPerson}</td>
                  <td className="py-3 px-4 cursor-pointer" onClick={() => handleViewDetails(client)}>{client.modules.join(', ')}</td>
                  <td className="py-3 px-4 cursor-pointer" onClick={() => handleViewDetails(client)}>${client.price}</td>
                  <td className="py-3 px-4 cursor-pointer" onClick={() => handleViewDetails(client)}>{client.paymentStatus}</td>
                  <td className="py-3 px-4 flex space-x-2">
                    <button
                      onClick={() => handleViewDetails(client)}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleDeleteClient(client.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      Delete
                    </button>
                  </td>
=======
        <div className="flex justify-between mb-4">
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="px-4 py-2 border rounded-lg w-1/3"
          >
            <option value="">Select User to Impersonate</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.contactPerson} ({client.organizationName})
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              if (selectedUserId) {
                useAuthStore.getState().impersonateUser(selectedUserId);
              }
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Impersonate
          </button>
        </div>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>Page {currentPage}</span>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={handleNextPage}
            disabled={filteredClients.length < clientsPerPage}
          >
            Next
          </button>
        </div>

        {isModalOpen && selectedClient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-xl w-4/5 md:w-1/2">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Client Details</h2>
                <button
                  className="text-red-500 text-lg hover:text-red-600"
                  onClick={() => setIsModalOpen(false)} // Close the modal
                >
                  X
                </button>
              </div>
              <div>
                <p><strong>Organization Name:</strong> {selectedClient.organizationName}</p>
                <p><strong>Contact Person:</strong> {selectedClient.contactPerson}</p>
                <p><strong>Contact Email:</strong> {selectedClient.contactEmail}</p>
                <p><strong>Modules:</strong> {selectedClient.modules.join(', ')}</p>
                <p><strong>Price:</strong> ${selectedClient.price}</p>
                <p><strong>Payment Status:</strong> {selectedClient.paymentStatus}</p>
              </div>
            </div>
          </div>
        )}

        {isAddClientModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-xl w-4/5 md:w-1/2">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Add New Client</h2>
                <button
                  className="text-red-500 text-lg hover:text-red-600"
                  onClick={closeAddClientModal}
                >
                  X
                </button>
              </div>
              <form onSubmit={handleAddClientSubmit}>
                <div className="mb-4">
                  <input
                    type="text"
                    name="organizationName"
                    placeholder="Organization Name"
                    value={newClient.organizationName}
                    onChange={handleInputChange}
                    className="px-4 py-2 border rounded-lg w-full"
                    required
                  />
                </div>
                <div className="mb-4">
                  <input
                    type="text"
                    name="contactPerson"
                    placeholder="Contact Person"
                    value={newClient.contactPerson}
                    onChange={handleInputChange}
                    className="px-4 py-2 border rounded-lg w-full"
                    required
                  />
                </div>
                <div className="mb-4">
                  <input
                    type="email"
                    name="contactEmail"
                    placeholder="Contact Email"
                    value={newClient.contactEmail}
                    onChange={handleInputChange}
                    className="px-4 py-2 border rounded-lg w-full"
                    required
                  />
                </div>
                <div className="mb-4">
                  <input
                    type="text"
                    name="contactPhone"
                    placeholder="Contact Phone"
                    value={newClient.contactPhone}
                    onChange={handleInputChange}
                    className="px-4 py-2 border rounded-lg w-full"
                    required
                  />
                </div>
                <div className="mb-4">
                  <input
                    type="number"
                    name="numberOfUsers"
                    placeholder="Number of Users"
                    value={newClient.numberOfUsers}
                    onChange={handleInputChange}
                    className="px-4 py-2 border rounded-lg w-full"
                    required
                  />
                </div>
                <div className="mb-4">
                  <select
                    name="modules"
                    value={newClient.modules[0] || ''}
                    onChange={handleModuleChange}
                    className="px-4 py-2 border rounded-lg w-full"
                  >
                    <option value="">Select Modules</option>
                    <option value="Attendance">Attendance</option>
                    <option value="Quiz">Quiz</option>
                    <option value="Library">Library</option>
                    <option value="Grading">Grading</option>
                  </select>
                </div>
                <div className="flex justify-between items-center">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  >
                    Add Client
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                    onClick={closeAddClientModal}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
