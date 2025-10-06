// src/components/LeaguesPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CreateLeagueModal from './CreateLeagueModal';
import JoinLeagueModal from './JoinLeagueModal';
import '../styles/Leagues.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || '';

/** Decode JWT (unsafe decode, only to read payload) */
function getUserIdFromToken(token) {
  try {
    if (!token) return null;
    const payload = token.split('.')[1];
    let b64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';
    const json = atob(b64);
    const obj = JSON.parse(json);
    return obj.userId || obj.user_id || null;
  } catch (err) {
    console.warn('Failed to decode token for userId', err);
    return null;
  }
}

const LeaguesPage = () => {
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('authToken');
  const currentUserId = getUserIdFromToken(token);

  useEffect(() => {
    const loadLeagues = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        const resp = await axios.get(`${API_BASE_URL}/api/leagues/my-leagues`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLeagues(Array.isArray(resp.data) ? resp.data : resp.data.leagues || []);
      } catch (err) {
        console.error('Error loading leagues:', err);
        setError('Failed to load leagues.');
      } finally {
        setLoading(false);
      }
    };

    loadLeagues();
  }, []);

  if (loading) return <div className="leagues-loading">Loading leagues...</div>;
  if (error) return <div className="leagues-error">{error}</div>;

  return (
    <div className="leagues-page-container">
      {/* Header Row */}
      <div className="leagues-header-row">
        <div className="leagues-header-left">
          <h2 className="leagues-title">My Leagues</h2>
          <div className="leagues-header-buttons">
            <button className="small" onClick={() => setShowCreate(true)}>Create League</button>
            <button className="small secondary" onClick={() => setShowJoin(true)}>Join League</button>
          </div>
        </div>
      </div>

      {/* League Cards */}
      <div className="league-cards-container">
        {leagues.length === 0 && (
          <div className="no-leagues">You haven't joined any leagues yet.</div>
        )}

        {leagues.map((league) => {
          const memberRankPairs = league.members.map((m) => ({
            userId: m._id.toString(),
            rank: typeof m.userStats?.rank === 'number' ? m.userStats.rank : Infinity,
          }));

          memberRankPairs.sort((a, b) => a.rank - b.rank);
          const memberCount = memberRankPairs.length;
          const idx = memberRankPairs.findIndex((m) => m.userId === currentUserId);
          const userRank = idx >= 0 && memberRankPairs[idx].rank !== Infinity ? idx + 1 : '-';

          return (
            <div className="league-card" key={league._id}>
              <div className="league-card-header">
                <h3 className="league-name">{league.name}</h3>
              </div>

              {league.description && (
                <p className="league-description">{league.description}</p>
              )}

              <div className="league-meta">
                <div className="league-rank">
                  <span className="label">League Rank:</span>
                  <span className="value">
                    {userRank} / {memberCount}
                  </span>
                </div>
              </div>

              <div className="league-card-actions">
                {league.creatorId === currentUserId && league.joinCode && (
                  <div className="creator-joincode">
                    Join Code: <span className="code">{league.joinCode}</span>
                  </div>
                )}
                <div className="actions">
                  <button
                    className="small-btn"
                    onClick={() => navigator.clipboard?.writeText(league._id?.toString() || '')}
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      <CreateLeagueModal
        show={showCreate}
        onHide={() => setShowCreate(false)}
        onLeagueCreated={(newLeague) => setLeagues([newLeague, ...leagues])}
      />

      <JoinLeagueModal
        show={showJoin}
        onHide={() => setShowJoin(false)}
        onLeagueJoined={(joinedLeague) => setLeagues([joinedLeague, ...leagues])}
      />
    </div>
  );
};

export default LeaguesPage;

