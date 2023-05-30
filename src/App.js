import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose,faTrashAlt, faEdit, faCheck } from '@fortawesome/free-solid-svg-icons';
import './App.css';

const App = () => {
  // State variables
  const [albums, setAlbums] = useState([]); // Array of albums
  const [newAlbumTitle, setNewAlbumTitle] = useState(''); // Title of a new album being added
  const [editAlbumId, setEditAlbumId] = useState(null); // ID of the album being edited
  const [editAlbumTitle, setEditAlbumTitle] = useState(''); // Updated title for the album being edited

  useEffect(() => {
    fetchAlbums(); // Fetch albums on component mount
  }, []);

  // Fetch albums from the API
  const fetchAlbums = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/albums');
      const data = await response.json();
      setAlbums(data);
    } catch (error) {
      console.error('Error fetching albums:', error);
    }
  };

   // Update an existing album
   const updateAlbum = async (id) => {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/albums/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editAlbumTitle,
        }),
      });
      const data = await response.json();
      const updatedAlbums = albums.map(album => (album.id === id ? data : album));
      setAlbums(updatedAlbums);
      cancelEdit();
    } catch (error) {
      console.error('Error updating album:', error);
    }
  };

  // Add a new album
  const addAlbum = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/albums', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newAlbumTitle,
          userId: 1, // Provide the appropriate user ID
        }),
      });
      const data = await response.json();
      setAlbums([...albums, data]);
      setNewAlbumTitle('');
    } catch (error) {
      console.error('Error adding album:', error);
    }
  };

 

  // Start editing an album
  const editAlbum = (id, title) => {
    setEditAlbumId(id);
    setEditAlbumTitle(title);
  };

  // Delete an album
  const deleteAlbum = async (id) => {
    try {
      await fetch(`https://jsonplaceholder.typicode.com/albums/${id}`, {
        method: 'DELETE',
      });
      const updatedAlbums = albums.filter(album => album.id !== id);
      setAlbums(updatedAlbums);
    } catch (error) {
      console.error('Error deleting album:', error);
    }
  };

   // Handle mouse over an album box
   const handleMouseOver = (key) => {
    const albumElement = document.getElementById(`album-${key}`);
    if (albumElement) {
      albumElement.classList.add('hovered');
    }
  };

  // Handle mouse out of an album box
  const handleMouseOut = (key) => {
    const albumElement = document.getElementById(`album-${key}`);
    if (albumElement) {
      albumElement.classList.remove('hovered');
    }
  };

  

  // Cancel editing an album
  const cancelEdit = () => {
    setEditAlbumId(null);
    setEditAlbumTitle('');
  };

 

  return (
    <div className="container">
      <h1 className="text-center mt-3 fontfy">Album Manager</h1>

      <h2 className="fontfy">Albums</h2>
      <div className="album-list">
        {albums.map(album => (
          <div
            key={album.id}
            id={`album-${album.id}`}
            className="album-box card mb-3"
            onMouseOver={() => handleMouseOver(album.id)}
            onMouseOut={() => handleMouseOut(album.id)}
          >
            <div className="card-body d-flex justify-content-between align-items-center">
              {editAlbumId === album.id ? (
                <div className="edit-album">
                  <input
                    type="text"
                    value={editAlbumTitle}
                    onChange={(e) => setEditAlbumTitle(e.target.value)}
                    className="form-control"
                  />
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="icon check-icon"
                    onClick={() => updateAlbum(album.id)}
                    style={{ cursor: 'pointer' }}
                  />
                  <FontAwesomeIcon
                    icon={faClose}
                    className="icon cancel-icon"
                    onClick={cancelEdit}
                    style={{ cursor: 'pointer' }}
                  />
                </div>
              ) : (
                <div className="album-title">
                  <strong>Title:</strong> {album.title}
                </div>
              )}

              <div className="album-actions">
                {editAlbumId !== album.id && (
                  <FontAwesomeIcon
                    icon={faEdit}
                    className="icon edit-icon"
                    onClick={() => editAlbum(album.id, album.title)}
                    style={{ cursor: 'pointer' }}
                  />
                )}
                <FontAwesomeIcon
                  icon={faTrashAlt}
                  className="icon delete-icon"
                  onClick={() => deleteAlbum(album.id)}
                  style={{ cursor: 'pointer' }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="fontfy">Add Album</h2>
      <div className="add-album input-group mb-3">
        <input
          type="text"
          value={newAlbumTitle}
          onChange={(e) => setNewAlbumTitle(e.target.value)}
          className="form-control"
        />
        <button onClick={addAlbum} className="btn btn-primary">
          Add
        </button>
      </div>
    </div>
  );
};

export default App;
