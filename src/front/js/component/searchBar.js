import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

export const SearchBar = () => {
  const { store, actions } = useContext(Context);
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    actions.autocomplete(value);
    setShowSuggestions(value.length > 0);
  };

  const handleSuggestionClick = (item) => {
    setSelectedItem(item);
    setQuery(item.name);
    setShowSuggestions(false);
  };

  const handleNavigate = () => {
    if (selectedItem) {
      navigate(`/${selectedItem.type}/${selectedItem.uid}`);
      setQuery("");
      setSelectedItem(null);
      setShowSuggestions(false);
    }
  };

  const handleInputClick = () => {
    setShowSuggestions(query.length > 0);
  };

  return (
    <div className="search-bar position-relative d-flex align-items-center">
      <div className="input-group flex-grow-1">
        <input
          type="text"
          className="form-control"
          value={query}
          onChange={handleChange}
          onClick={handleInputClick}
          placeholder="Search..."
        />
        {showSuggestions && store.suggestions.length > 0 && (
          <div
            className="dropdown-menu show position-absolute"
            style={{ zIndex: 999, width: "100%", top: "100%", left: 0 }}
          >
            <div className="list-group">
              {store.suggestions.map((item, index) => (
                <button
                  key={index}
                  className="list-group-item list-group-item-action"
                  onClick={() => handleSuggestionClick(item)}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <button className="btn btn-outline-warning ms-2" onClick={handleNavigate}>
        Search
      </button>
    </div>
  );
};
