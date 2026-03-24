import FormField from '../../../components/ui/FormField'

function PasswordForm() {
  return (
    <form className="grid gap-4 md:grid-cols-3">
      <FormField label="Current password">
        <input type="password" className="input input-bordered" placeholder="••••••••" aria-label="Current password" />
      </FormField>
      <FormField label="New password">
        <input type="password" className="input input-bordered" placeholder="••••••••" aria-label="New password" />
      </FormField>
      <FormField label="Confirm password">
        <input type="password" className="input input-bordered" placeholder="••••••••" aria-label="Confirm password" />
      </FormField>
    </form>
  )
}

export default PasswordForm
