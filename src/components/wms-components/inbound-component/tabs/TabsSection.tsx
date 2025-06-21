const TabsSection = ({ tabs, activeTab, onTabChange }: any) => {
  return (
    <div className="border-b mb-6">
      <div className="flex space-x-8 text-orange-600 font-semibold">
        {tabs.map((tab: any, idx: number) => (
          <button
            key={tab.label || tab}
            onClick={() => onTabChange(idx)}
            className={`pb-2 transition ${
              activeTab === idx
                ? "border-b-2 border-orange-600"
                : "hover:text-orange-700"
            }`}
          >
            {tab.label || tab}
          </button>
        ))}
      </div>
      <div className="mt-4">{tabs[activeTab]?.content}</div>
    </div>
  );
};

export default TabsSection;
