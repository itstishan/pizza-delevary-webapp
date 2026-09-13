// centralized API base URL - set REACT_APP_API_URL in .env instead of hardcoding localhost across every component
export const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
