import { ReactComponent as DeleteSvg } from '@/assets/icon/delete-garbage.svg';

export default function DeleteIcon({ className, onClick }) {
  return (
    <span className={className}>
      <DeleteSvg onClick={onClick} />
    </span>
  );
}
