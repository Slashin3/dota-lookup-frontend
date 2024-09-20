import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [accountId, setAccountId] = useState("");
  const [playerData, setPlayerData] = useState(null);
  const [recentMatches, setRecentMatches] = useState([]);
  const [heroes, setHeroes] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Game mode mapping
  const gameModeMap = {
    0: "None",
    1: "All Pick",
    2: "Captain's Mode",
    3: "Random Draft",
    4: "Single Draft",
    5: "All Random",
    6: "Intro",
    7: "Diretide",
    8: "Reverse Captain's Mode",
    9: "The Greeviling",
    10: "Tutorial",
    11: "Mid Only",
    12: "Least Played",
    13: "Limited Heroes",
    14: "Custom",
    22: "Ranked"
    // Add more game modes if needed
  };

  // Fetch hero data
  useEffect(() => {
    const fetchHeroes = async () => {
      try {
        const response = await fetch("https://api.opendota.com/api/heroes");
        if (!response.ok) throw new Error("Error fetching heroes");
        const data = await response.json();
        const heroMap = data.reduce((acc, hero) => {
          const heroName = hero.name
            .replace("npc_dota_hero_", "")
            .replace(/_/g, "-")
            .toLowerCase();
          let formattedName = heroName;
          switch (heroName) {
            case "chaos-knight":
              formattedName = "chaos_knight";
              break;
            case "sand-king":
              formattedName = "sand_king";
              break;
            case "phantom-assassin":
              formattedName = "phantom_assassin";
              break;
            case "crystal-maiden":
              formattedName = "crystal_maiden";
              break;
            case "legion-commander":
              formattedName = "legion_commander";
              break;
            case "shadow-demon":
              formattedName = "shadow_demon";
              break;
            case "skywrath-mage":
              formattedName = "skywrath_mage";
              break;
            case "naga-siren":
              formattedName = "naga_siren";
              break;
            case "monkey-king":
              formattedName = "monkey_king";
              break;
            case "dragon-knight":
              formattedName = "dragon_knight";
              break;
            case "templar-assassin":
              formattedName = "templar_assassin";
              break;
            case "earth-spirit":
              formattedName = "earth_spirit";
              break;
            default:
              break;
          }
          acc[hero.id] = {
            name: hero.localized_name,
            img: `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${formattedName}.png`,
          };
          return acc;
        }, {});
        setHeroes(heroMap);
      } catch (err) {
        console.error(err);
      }
    };

    fetchHeroes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://dota-lookup-backend.onrender.com/players/${accountId}`
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Error fetching player data");
      }
      const data = await response.json();
      setPlayerData(data);

      // Fetch recent matches after getting player data
      const matchesResponse = await fetch(
        `https://dota-lookup-backend.onrender.com/api/recent-matches/${accountId}`
      );
      if (!matchesResponse.ok) {
        throw new Error("Error fetching recent matches");
      }
      const matchesData = await matchesResponse.json();
      setRecentMatches(matchesData);
    } catch (err) {
      setError(err.message);
      setPlayerData(null);
      setRecentMatches([]); // Clear recent matches on error
    } finally {
      setLoading(false);
    }
  };

  const rankTierMap = {
    11: "Herald 1",
    12: "Herald 2",
    13: "Herald 3",
    14: "Herald 4",
    15: "Herald 5",
    21: "Guardian 1",
    22: "Guardian 2",
    23: "Guardian 3",
    24: "Guardian 4",
    25: "Guardian 5",
    31: "Crusader 1",
    32: "Crusader 2",
    33: "Crusader 3",
    34: "Crusader 4",
    35: "Crusader 5",
    41: "Archon 1",
    42: "Archon 2",
    43: "Archon 3",
    44: "Archon 4",
    45: "Archon 5",
    51: "Legend 1",
    52: "Legend 2",
    53: "Legend 3",
    54: "Legend 4",
    55: "Legend 5",
    61: "Ancient 1",
    62: "Ancient 2",
    63: "Ancient 3",
    64: "Ancient 4",
    65: "Ancient 5",
    71: "Divine 1",
    72: "Divine 2",
    73: "Divine 3",
    74: "Divine 4",
    75: "Divine 5",
    80: "Immortal",
  };

  return (
    <div className="App">
      <h1>OpenDota Player Lookup</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="account_id">Enter Account ID:</label>
        <input
          type="text"
          id="account_id"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          required
        />
        <button type="submit">Search</button>
      </form>

      <div className="player-data">
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {playerData && playerData.profile && (
          <div>
            <h2>{playerData.profile.personaname}</h2>
            <img
              src={playerData.profile.avatarfull}
              alt="Player Avatar"
              style={{ borderRadius: "50%", width: "150px", height: "150px" }}
            />
            <p>
              <strong>Steam ID:</strong> {playerData.profile.steamid}
            </p>
            <p>
              <strong>Country:</strong> {playerData.profile.loccountrycode}
            </p>
            <p>
              <strong>Rank Tier:</strong>{" "}
              {playerData.rank_tier !== undefined
                ? rankTierMap[playerData.rank_tier]
                : "Unranked"}
            </p>

            <p>
              <strong>Plus User:</strong>{" "}
              {playerData.profile.plus ? "Yes" : "No"}
            </p>
            <p>
              <a
                className="steam-profile"
                href={playerData.profile.profileurl}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Steam Profile
              </a>
            </p>
            {playerData.profile.last_login && (
              <p>
                <strong>Last Login:</strong>{" "}
                {new Date(playerData.profile.last_login).toLocaleString()}
              </p>
            )}
          </div>
        )}
      </div>

      {recentMatches.length > 0 && (
        <div className="recent-matches">
          <h2>Recent Matches</h2>
          <table>
            <thead>
              <tr>
                <th>Match ID</th>
                <th>Hero</th>
                <th>Result</th>
                <th>Kills</th>
                <th>Deaths</th>
                <th>Assists</th>
                <th>Duration</th>
                <th>Game Mode</th> {/* Displaying ranked in game mode */}
              </tr>
            </thead>
            <tbody>
              {recentMatches.map((match) => (
                <tr key={match.match_id}>
                  <td>{match.match_id}</td>
                  <td>
                    {heroes[match.hero_id] ? (
                      <span>
                        <img
                          src={heroes[match.hero_id].img}
                          alt={heroes[match.hero_id].name}
                          style={{
                            width: "30px",
                            height: "20px",
                            marginRight: "5px",
                          }}
                        />
                        {heroes[match.hero_id].name}
                      </span>
                    ) : (
                      "Unknown"
                    )}
                  </td>
                  <td>{match.rank_tier < 128 ? "Win" : "Lose"}</td>
                  <td>{match.kills}</td>
                  <td>{match.deaths}</td>
                  <td>{match.assists}</td>
                  <td>
                    {Math.floor(match.duration / 60)}:
                    {match.duration % 60 < 10 ? "0" : ""}
                    {match.duration % 60}
                  </td>
                  <td>{gameModeMap[match.game_mode] || "Unknown"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
