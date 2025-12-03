// src/components/Home/HomeView.jsx
import React from 'react';
// Apne asli components ko import karein
import UserFeed from './Feed'; 
import Suggestions from './Suggestions';
import './Home.css';

// Home View (Feed + Suggestions)
export default function HomeView({ refreshSignal }) {
    return (
        <div className="content-container home-view-grid">
            {/* 2a. Center Feed Column */}
            <div className="home-view-feed">
                {/* Asli component ka istemaal karein */}
                <UserFeed  refreshSignal={refreshSignal}/>
            </div>
            {/* 2b. Right Suggestions Column */}
            <div className="home-view-suggestions">
                {/* Asli component ka istemaal karein */}
                <Suggestions />
            </div>
        </div>
    );
}

// !! IMPORTANT !!
// Aapke App.jsx se 'UserFeedPlaceholder' aur 'UserSuggestionsPlaceholder'
// components ko delete kar dein. Unka code ab 'UserFeed.jsx' aur 
// 'Suggestions.jsx' files ke andar hona chahiye.