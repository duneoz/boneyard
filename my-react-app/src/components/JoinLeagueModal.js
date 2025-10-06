// src/components/JoinLeagueModal.js
import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { joinLeague } from '../api/leagues';
import { toast } from 'react-toastify';
import "../styles/Leagues.css";

const JoinLeagueModal = ({ show, onHide, onLeagueJoined }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!code.trim()) {
      toast.error('League code is required.');
      return;
    }

    setLoading(true);
    try {
      const joinedLeague = await joinLeague(code);
      toast.success('Joined league successfully!');
      onLeagueJoined(joinedLeague); // Update parent list
      setCode('');
      onHide();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to join league.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Form onSubmit={handleJoin}>
        <Modal.Header closeButton>
          <Modal.Title>Join League</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>League Code</Form.Label>
            <Form.Control
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter league code"
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Joining...' : 'Join League'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default JoinLeagueModal;
