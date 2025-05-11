import React from "react";
import { useTranslation } from 'react-i18next';
const HomePage = () => {
  const { t } = useTranslation();
  return <div className="
       font-bold py-2 text-base font-montserrat sm:text-lg md:text-xl lg:text-2xl xl:text-3xl color-primary flex justify-center items-center">{t("HomePage")}</div>;
};

export default HomePage;
