// src/components/Chat/MessageReactions.jsx
import React from 'react';

const MessageReactions = ({ reactionsMap }) => {
    console.log("[MessageReactions] Rendering with reactionsMap:", reactionsMap);
    // Convert Map to Array for rendering
    const reactionArray = reactionsMap ? Array.from(reactionsMap.entries()) : [];
    if (reactionArray.length === 0) return null; // Don't render if no reactions

    // Group emojis and count them (optional enhancement)
    const emojiCounts = reactionArray.reduce((acc, [userId, emoji]) => {
        acc[emoji] = (acc[emoji] || 0) + 1;
        return acc;
    }, {});
    const uniqueEmojis = Object.keys(emojiCounts);

    return (
        <div className="message-reactions">
            {uniqueEmojis.map((emoji) => (
                <span key={emoji} className="reaction-emoji" title={`${emojiCounts[emoji]} reaction${emojiCounts[emoji] > 1 ? 's' : ''}`}>
                    {emoji}
                    {/* Show count if more than 1 */}
                    {emojiCounts[emoji] > 1 && <span className="reaction-count">{emojiCounts[emoji]}</span>}
                </span>
            ))}
        </div>
    );
};

export default MessageReactions;