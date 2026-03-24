import FormField from '../../../components/ui/FormField'

function ProfileDetailsForm({ user }) {
  return (
    <form className="grid gap-6 md:grid-cols-2">
      <FormField label="Full name" hint="Visible to teammates">
        <input type="text" className="input input-bordered" defaultValue={user.name} />
      </FormField>
      <FormField label="Email" hint="Notifications are sent here">
        <input type="email" className="input input-bordered" defaultValue={user.email} />
      </FormField>
      <FormField label="Timezone" hint="Affects SLA windows">
        <input type="text" className="input input-bordered" defaultValue={user.timezone} />
      </FormField>
      <FormField label="Notification email" hint="Ops alias">
        <input type="email" className="input input-bordered" placeholder="ops@swiftbridge.io" />
      </FormField>
      <div className="md:col-span-2">
        <button type="button" className="btn btn-primary w-full md:w-auto" aria-label="Save profile">
          Save profile (UI only)
        </button>
      </div>
    </form>
  )
}

export default ProfileDetailsForm
