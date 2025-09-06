// Ajoutez cette condition dans votre navigation
{user && user.role === 'manager' && (
  <li>
    <Link to="/manager">Espace Gestionnaire</Link>
  </li>
)}