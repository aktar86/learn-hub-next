import AsideSection from "@/src/components/CreatorDashboard/Aside/Aside";

const layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="flex justify-between max-h-screen ">
      <AsideSection />

      <div className=" flex-1 ml-64  p-5">{children}</div>
    </div>
  );
};

export default layout;
