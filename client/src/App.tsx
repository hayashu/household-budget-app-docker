import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AddTransactionForm from './pages/AddTransactionForm';
import TransactionHistory from './pages/TransactionHistory';
import CategoryManagement from './pages/CategoryManagement';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add" element={<AddTransactionForm />} />
        <Route path="/history" element={<TransactionHistory />} />
        <Route path="/category" element={<CategoryManagement />} />
      </Routes>
    </Router>
  );
}

export default App;