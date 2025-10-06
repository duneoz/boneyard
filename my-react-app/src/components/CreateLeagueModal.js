// src/components/CreateLeagueModal.js
import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { createLeague, fetchUserLeagues } from '../api/leagues';
import { toast } from 'react-toastify';
import "../styles/Leagues.css";

const CreateLeagueModal = ({ show, onHide, onLeagueCreated }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('League name is required.');
      return;
    }

    setLoading(true);
    try {
      // Fetch current user's leagues to check limit
      const userLeagues = await fetchUserLeagues();
      if (userLeagues.length >= 10) {
        toast.error('You cannot create more than 10 leagues.');
        setLoading(false);
        return;
      }

      const newLeague = await createLeague(name, description);

      // Success toast
      toast.success('League created successfully!');

      // ⚡ Show join code toast if user is the creator
      if (newLeague.creatorId === newLeague.members[0]?._id) {
        const JoinCodeToast = () => (
          <div>
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>Join Code:</strong>{' '}
              <span
                style={{
                  userSelect: 'text', // make code selectable
                  fontFamily: 'monospace',
                }}
              >
                {newLeague.joinCode}
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(newLeague.joinCode);
                  toast.success('Join Code copied to clipboard!');
                }}
                style={{
                  padding: '0.2rem 0.5rem',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  background: '#f8f9fa',
                  marginLeft: '0.5rem',
                }}
              >
                Copy
              </button>
            </div>
            <div>Join Code can be found on the League card for future reference.</div>
          </div>
        );

        toast.info(<JoinCodeToast />, {
          autoClose: 12000, // 12 seconds
          closeOnClick: false, // prevent accidental dismissal
          pauseOnHover: true,
          draggable: true,
        });
      }

      // Update parent list
      onLeagueCreated(newLeague);

      // Reset form
      setName('');
      setDescription('');

      // Close modal
      onHide();
    } catch (err) {
      console.error('Error creating league:', err);
      toast.error(err.response?.data?.message || 'Failed to create league.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Form onSubmit={handleCreate}>
        <Modal.Header closeButton>
          <Modal.Title>Create League</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>League Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter league name"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description (optional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a description"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create League'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CreateLeagueModal;
