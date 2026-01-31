import {
  UserGroupIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { fetchCardData } from '@/app/lib/data';

// Mapping card types to icons
const iconMap = {
  total: UserGroupIcon,
  accepted: CheckCircleIcon,
  pending: ClockIcon,
  rejected: XCircleIcon,
};

export default async function CardWrapper() {
  const {
    totalApplicants,
    acceptedApplicants,
    pendingApplicants,
  } = await fetchCardData();

  return (
    <>
      <Card title="Total Applicants" value={totalApplicants} type="total" />
      <Card title="Accepted" value={acceptedApplicants} type="accepted" />
      <Card title="Pending" value={pendingApplicants} type="pending" />
    </>
  );
}

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: 'total' | 'accepted' | 'pending' | 'rejected';
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon && <Icon className="h-5 w-5 text-gray-700" />}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`${lusitana.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}
