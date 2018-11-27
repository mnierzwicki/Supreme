import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import PropTypes from "prop-types";

import Error from "./ErrorMessage";
import Table from "./styles/Table";

const ALL_USERS_QUERY = gql`
  query {
    users {
      id
      name
      email
      permissions
    }
  }
`;

const UPDATE_PERMISSIONS_MUTATION = gql`
  mutation UPDATE_PERMISSIONS_MUTATION($permissions: [Permission]!, $userId: ID!) {
    updatePermissions(permissions: $permissions, userId: $userId) {
      id
      permissions
      name
      email
    }
  }
`;

// TODO: Add API for retrieving all possible permissions
const possiblePermissions = ["ADMIN", "USER", "ITEMCREATE", "ITEMUPDATE", "ITEMDELETE", "PERMISSIONUPDATE"];

const Permissions = props => (
  <Query query={ALL_USERS_QUERY}>
    {({ data, error, loading }) => (
      <div>
        {error && <Error error={error} />}
        <div>
          <h2>Manage Permissions</h2>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                {possiblePermissions.map(permission => (
                  <th key={permission}>{permission}</th>
                ))}
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {data.users.map(user => (
                <UserPermissions key={`${user.id}-permissions`} user={user} />
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    )}
  </Query>
);

class UserPermissions extends React.Component {
  static propTypes = {
    user: PropTypes.shape({
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      permissions: PropTypes.array.isRequired
    }).isRequired
  };

  state = {
    permissions: this.props.user.permissions
  };

  handlePermissionChange = event => {
    let updatedPermissions = [...this.state.permissions];
    const checkbox = event.target;

    if (checkbox.checked) {
      updatedPermissions.push(checkbox.value);
    } else {
      updatedPermissions = updatedPermissions.filter(permission => permission !== checkbox.value);
    }

    this.setState({ permissions: updatedPermissions });
  };

  render() {
    const user = this.props.user;
    return (
      <Mutation mutation={UPDATE_PERMISSIONS_MUTATION} variables={{ permissions: this.state.permissions, userId: user.id }}>
        {(updatePermissions, { error, loading }) => (
          <>
            {error && <Error error={error} />}

            <tr>
              <td>{user.name}</td>
              <td>{user.email}</td>
              {possiblePermissions.map(permission => (
                <td key={`${user.id}-permission-${permission}`}>
                  <label htmlFor={`${user.id}-permission-${permission}`}>
                    <input
                      id={`${user.id}-permission-${permission}`}
                      type="checkbox"
                      checked={this.state.permissions.includes(permission)}
                      value={permission}
                      onChange={this.handlePermissionChange}
                    />
                  </label>
                </td>
              ))}
              <td>
                <button type="button" disabled={loading} onClick={updatePermissions}>
                  {loading ? "Updating..." : "Update"}
                </button>
              </td>
            </tr>
          </>
        )}
      </Mutation>
    );
  }
}

export default Permissions;
