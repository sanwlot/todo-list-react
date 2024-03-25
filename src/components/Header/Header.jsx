import AuthModal from "../AuthModal";
import "./Header.css";

export default function Header({ username }) {
  return (
    <header>
      <h1>Todo list</h1>
      <AuthModal username={username} />
      <div>{username}</div>
    </header>
  );
}
