interface AccountHeaderProps {
  title: string;
  subtitle: string;
}

const AccountHeader = ({ title, subtitle }: AccountHeaderProps) => {
  return (
    <div className="border-b border-white/10 px-4 py-8 sm:px-8 lg:px-12 xl:px-20">
      <h1 className="font-ClashGrotesk-Semibold text-3xl sm:text-4xl uppercase">
        {title}
      </h1>
      <p className="mt-2 text-sm text-white/50">{subtitle}</p>
    </div>
  );
};

export default AccountHeader;
