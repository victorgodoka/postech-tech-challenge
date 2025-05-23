"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  ReactElement,
} from "react";
import clsx from "clsx";

type TabsContextType = {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
};

const TabsContext = createContext<TabsContextType | undefined>(undefined);

type TabsProps = {
  children: ReactNode;
  defaultIndex?: number;
  activeIndex?: number;
  onTabChange?: (index: number) => void;
};

export function Tabs({
  children,
  defaultIndex = 0,
  activeIndex: controlledIndex,
  onTabChange,
}: TabsProps) {
  const [internalIndex, setInternalIndex] = useState(defaultIndex);
  const isControlled = controlledIndex !== undefined;
  const currentIndex = isControlled ? controlledIndex : internalIndex;

  const setActiveIndex = (index: number) => {
    if (!isControlled) {
      setInternalIndex(index);
    }
    onTabChange?.(index);
  };

  const childrenArray = React.Children.toArray(children).filter(
    React.isValidElement
  ) as ReactElement<{ children: ReactNode }>[];

  const titles = childrenArray.map((child, index) => {
    const childrenOfTab = React.Children.toArray(child.props.children).filter(
      React.isValidElement
    ) as ReactElement[];

    const title = childrenOfTab.find(
      (c) =>
        typeof c.type === "function" &&
        (c.type as { displayName?: string }).displayName === "TabTitle"
    ) as ReactElement | undefined;

    return (
      <li key={index} className="me-2">
        <button
          onClick={() => setActiveIndex(index)}
          className={clsx(
            "inline-block px-8 py-4 border-b-2 rounded-t-lg outline-none",
            "focus:ring-0 cursor-pointer w-full",
            index === currentIndex
              ? "text-green border-green"
              : "text-black/50 border-transparent hover:text-black/85 hover:border-black/85"
          )}
        >
          {(title?.props as { children: ReactNode })?.children}
        </button>
      </li>
    );
  });

  const content = childrenArray.map((child, index) =>
    React.cloneElement(child as ReactElement<{ index?: number }>, {
      index,
      key: index,
    })
  );

  return (
    <TabsContext.Provider value={{ activeIndex: currentIndex, setActiveIndex }}>
      <div className="text-sm font-medium text-center text-black">
        <ul className="grid grid-cols-2 md:grid-cols-4">{titles}</ul>
      </div>
      {content}
    </TabsContext.Provider>
  );
}

export function Tab({
  children,
  index,
}: {
  children: ReactNode;
  index?: number;
}) {
  const { activeIndex } = useTabsContext();

  if (index !== activeIndex) return null;

  const validChildren = React.Children.toArray(children).filter(
    React.isValidElement
  ) as ReactElement[];

  const container = validChildren.find(
    (c) =>
      typeof c.type === "function" &&
      (c.type as { displayName?: string }).displayName === "TabContainer"
  );

  return container ?? null;
}

Tab.Title = function TabTitle({ children }: { children: ReactNode }) {
  return <>{children}</>;
};
(Tab.Title as React.FC & { displayName?: string }).displayName = "TabTitle";

Tab.Container = function TabContainer({ children }: { children: ReactNode }) {
  return <div className="p-4">{children}</div>;
};
(Tab.Container as React.FC & { displayName?: string }).displayName =
  "TabContainer";

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tab must be used inside a <Tabs> provider");
  }
  return context;
}
