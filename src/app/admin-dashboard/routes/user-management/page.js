import Link from "next/link";

const users = [
  { id: "12345", email: "suraj@gmail.com" },
  { id: "67891", email: "poulomi@gmail.com" },
  { id: "12342", email: "suraj@gmail.com" },
  { id: "67893", email: "poulomi@gmail.com" },
  { id: "12344", email: "suraj@gmail.com" },
  { id: "67896", email: "poulomi@gmail.com" },
  { id: "12347", email: "suraj@gmail.com" },
  { id: "67899", email: "poulomi@gmail.com" },
];

export default function UserManagement() {
  return (
    <div className="Margin80Auto ShadowPrimary FlexBoxColumn BorderRadius4 OverflowHidden BoxW96Hauto Padding30 Gap25 BackgroundN RoutesMainContainer">
      <h1 className="Header TextAlignCenter">User Management</h1>

      <form className="Form JustifyCenter Gap35">
        <div className="FormGroup Box100w Gap15 JustifyStart">
          <label>Filters</label>
          <div className="FlexBoxRow Gap10 Font400">
            <select className="FormGroup Box100w Gap15 JustifyStart Padding10" >
              <option value="date">Date</option>
              <option value="type">Type</option>
              <option value="active">Active</option>
            </select>
          </div>
        </div>
      </form>

      <p className="Header ManageUsersLabel">Manage Users</p>

      <table className="MainTable">
        <thead>
          <tr>
            <th>User ID</th>
            <th>User Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td>
                <div className="Actions">
                  <Link href="#" className="ActionsLinks DeleteLink">
                    Delete
                  </Link>
                  <Link href="#" className="ActionsLinks UpdateLink">
                    Update
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
