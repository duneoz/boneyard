// src/components/JoinLeagueModal.js
import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { joinLeague } from '../api/leagues';
import { toast } from 'react-toastify';
import "../styles/Leagues.css";
import '../styles/LoginModal.css'; // Reuse modal styles

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
          <Form.Group className="input-container">
            <input
              id="league-code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder=" "
              required
            />
            <label htmlFor="league-code">Enter League Code</label>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          
          <Button className="modal-button submit" type="submit" disabled={loading}>
            {loading ? 'Joining...' : 'Join League'}
          </Button>

          <Button className="modal-button close" onClick={onHide} disabled={loading}>
            Cancel
          </Button>

        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default JoinLeagueModal;
