import React from "react";
import MenuLayout from "../layouts/MenuLayout";
import { Outlet } from "react-router";

export const WithNav = () => {
  return (
    <MenuLayout>
      <Outlet />
    </MenuLayout>
  );
};

export const WithoutNav = () => <Outlet />;
