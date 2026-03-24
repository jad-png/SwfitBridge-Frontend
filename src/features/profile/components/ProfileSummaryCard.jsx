import { Camera, CheckCircle2, Shield } from 'lucide-react'
import CardSurface from '../../../components/ui/CardSurface'
import SectionLabel from '../../../components/ui/SectionLabel'

function ProfileSummaryCard({ user }) {
  return (
    <CardSurface>
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="avatar placeholder">
          <div className="w-24 rounded-2xl bg-primary/10 text-primary">
            <span className="text-3xl font-semibold">{user.name.split(' ').map((word) => word[0]).join('').slice(0, 2)}</span>
          </div>
        </div>
        <button type="button" className="btn btn-sm btn-outline" aria-label="Update profile photo">
          <Camera className="h-4 w-4" aria-hidden />
          Update photo
        </button>
      </div>

      <div className="rounded-2xl border border-base-200/80 p-5 text-left">
        <p className="text-lg font-semibold text-base-content">{user.name}</p>
        <p className="text-sm text-base-content/70">{user.email}</p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="badge badge-outline">{user.role}</span>
          <span className="badge badge-outline">{user.timezone}</span>
        </div>
        <p className="muted-text mt-4">{user.lastSeen}</p>
      </div>

      <div className="rounded-2xl border border-dashed border-base-300/80 p-4 text-sm">
        <SectionLabel title="Security posture" size="xs" />
        <ul className="mt-3 space-y-2">
          <li className="flex items-center gap-2 text-success">
            <CheckCircle2 className="h-4 w-4" aria-hidden /> MFA enrolled
          </li>
          <li className="flex items-center gap-2 text-info">
            <Shield className="h-4 w-4" aria-hidden /> Session timeout 30m
          </li>
        </ul>
      </div>
    </CardSurface>
  )
}

export default ProfileSummaryCard
