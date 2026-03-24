import CardSurface from '../../../components/ui/CardSurface'
import SectionLabel from '../../../components/ui/SectionLabel'
import StatusBadge from '../../../components/ui/StatusBadge'

function UserManagementTable({ users }) {
  return (
    <CardSurface title="User management" subtitle="Activate, pause, or adjust roles (UI only)">
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr className="eyebrow-text text-xs text-base-content/50">
              <th scope="col">User</th>
              <th scope="col">Role</th>
              <th scope="col">Status</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((row) => (
              <tr key={row.email}>
                <td>
                  <div>
                    <p className="font-semibold">{row.name}</p>
                    <p className="text-sm text-base-content/60">{row.email}</p>
                  </div>
                </td>
                <td>
                  <span className="badge badge-outline">{row.role}</span>
                </td>
                <td>
                  <StatusBadge status={row.status} />
                </td>
                <td>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" className="btn btn-ghost btn-xs" aria-label={`Activate ${row.name}`}>
                      Activate
                    </button>
                    <button type="button" className="btn btn-ghost btn-xs" aria-label={`Deactivate ${row.name}`}>
                      Deactivate
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <SectionLabel title="Directory sync" size="xs" subtitle="Static UI" />
      <button type="button" className="btn btn-outline btn-sm" aria-label="Sync directory">
        Sync directory
      </button>
    </CardSurface>
  )
}

export default UserManagementTable
