import React, { useState, useEffect, useRef, useMemo } from 'react';

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {
  useAlternatePageUtils,
  useDocsPreferredVersion,
} from '@docusaurus/theme-common';
// import useBaseUrl from '@docusaurus/useBaseUrl';

import DropdownBg from './dropdown-bg.svg';
import DropdownIcon from './dropdown.svg';
import ArrowRightIcon from '../icons/arrow-right.svg';
import clsx from 'clsx';

import { useGlobalActiveContext } from '../NavbarItem/useApiContext';
import {
  useVersions,
  useLatestVersion,
} from '@docusaurus/plugin-content-docs/client';
import { WithLocalLink } from './WithVersionUrl';
import Link from '@docusaurus/Link';

export const DropdownNavbarItem: React.FC<{
  label: string | React.ReactNode;
  description: string | React.ReactNode;
  items: { label: string; href: string; isExternal?: boolean }[];
}> = ({ label, items, description }) => {
  return (
    <div className="group relative">
      <div className="cursor-pointer hover:text-brand-cyan">{label}</div>
      <div className="opacity-0 invisible -translate-y-2.5 dropdown-transition absolute -right-48 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
        <div className="ml-96 mt-2 h-0 w-0 border-x-8 border-x-transparent border-b-[16px]"></div>
        <div className="flex shadow-lg rounded-sm bg-grey-0">
          <div className="flex-1 brand-cyan-gradients relative">
            <DropdownBg />
            <div className="absolute inset-x-0 bottom-6 flex items-center px-9 space-y-6 text-black">
              <div>
                <h3 className="font-bold block">{description}</h3>
              </div>
            </div>
          </div>
          <div className="flex-1 px-12">
            <div className="mt-12 border-b border-grey-4"></div>
            <div className="font-bold my-2">{label}</div>
            <ul className="flex-1 w-48 space-y-2">
              {items.map((item, i) => (
                <li className="text-grey-4" key={i}>
                  <WithLocalLink
                    className="whitespace-nowrap block"
                    isExternal={item.isExternal}
                    label={item.label}
                    href={item.href}
                  ></WithLocalLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SimpleDropdown: React.FC<{
  position?: 'top' | 'bottom';
  items: {
    label: string;
    href: string;
    active?: boolean;
    isNavLink?: boolean;
    popover?: React.ReactNode;
  }[];
  label: string;
  labelNode?: React.ReactNode;
}> = ({ label, labelNode, items, position }) => {
  return (
    <div className="group relative">
      {labelNode ? (
        labelNode
      ) : (
        <div className="flex cursor-pointer items-center justify-between bg-grey-1 border rounded-sm py-[6px] rounded-full px-3">
          <span className="mr-3">{label}</span>
          <DropdownIcon className="text-brand-cyan" />
        </div>
      )}
      <div
        className={clsx(
          'opacity-0 invisible -translate-y-2.5 dropdown-transition flex absolute min-w-[10rem] shadow-lg border rounded-sm bg-grey-0 p-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 z-10',
          position === 'top' ? 'bottom-[2.5rem]' : 'top-[2.5rem]'
        )}
      >
        <ul className="space-y-2 w-full">
          {items.map((item, index) => (
            <DropDownItemLink
              key={index}
              href={item.href}
              label={item.label}
              active={item.active}
              isNavLink={item.isNavLink}
              popover={item.popover}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export const CollapseDropDown: React.FC<{
  items: { label: string; href: string; active?: boolean }[];
  label: string;
}> = ({ label, items }) => {
  const [isHidden, setIsHidden] = useState(true);
  return (
    <li>
      <div
        className="flex justify-between items-center px-2 py-1"
        onClick={() => setIsHidden(!isHidden)}
      >
        <span>{label}</span>
        <span className={clsx({ 'rotate-180': !isHidden })}>
          <DropdownIcon />
        </span>
      </div>
      <ul
        className={clsx(
          'dropdown-transition',
          isHidden
            ? 'hidden overflow-hidden h-0'
            : 'block overflow-visible h-auto'
        )}
      >
        {items.map((item, index) => (
          <DropDownItemLink href={item.href} label={item.label} key={index} />
        ))}
      </ul>
    </li>
  );
};

const DropDownItemLink: React.FC<{
  href: string;
  label: string;
  active?: boolean;
  isNavLink?: boolean;
  popover?: React.ReactNode;
}> = ({ href, label, active, isNavLink, popover }) => {
  // const to = useBaseUrl(href)
  const [showpopover, setShowpopover] = useState(false);
  return (
    <li className={clsx(active ? 'text-brand-cyan bg-grey-2 active' : '')}>
      {popover ? (
        <div
          className="block px-4 py-[2px] whitespace-nowrap relative cursor-pointer hover:text-brand-cyan"
          onMouseEnter={() => setShowpopover(true)}
          onMouseLeave={() => setShowpopover(false)}
        >
          <div>{label}</div>
          <div className={clsx('absolute', showpopover ? 'block' : 'hidden')}>
            {popover}
          </div>
        </div>
      ) : isNavLink ? (
        <a className="block px-4 py-[2px] whitespace-nowrap" href={href}>
          {label}
        </a>
      ) : (
        <Link className="block px-4 py-[2px] whitespace-nowrap" href={href}>
          {label}
        </Link>
      )}
    </li>
  );
};

export const LocaleDropdownNavbarItem: React.FC<{
  position?: 'top' | 'bottom';
}> = ({ position }) => {
  const {
    i18n: { currentLocale, locales, localeConfigs },
    siteConfig: {customFields: { localeUrls } },
  } = useDocusaurusContext();

  const alternatePageUtils = useAlternatePageUtils();

  function getLocaleLabel(locale: string) {
    return localeConfigs[locale].label;
  }
  const localeItems = locales.map((locale) => {
    const to = localeUrls[locale] || `${alternatePageUtils.createUrl({
      locale,
      fullyQualified: false,
    })}`;

    return {
      label: getLocaleLabel(locale),
      href: to,
      active: currentLocale === locale,
      isNavLink: true,
    };
  });

  return (
    <SimpleDropdown
      position={position}
      label={getLocaleLabel(currentLocale)}
      items={localeItems}
    />
  );
};

const getVersionMainDoc = (version) =>
  version.docs.find((doc) => doc.id === version.mainDocId);

export const VersionDropdownNavbarItem: React.FC<{
  position?: 'top' | 'bottom';
}> = ({ position }) => {
  const activeContext = useGlobalActiveContext();

  const versions = useVersions();
  const latestVersion = useLatestVersion();

  const { preferredVersion, savePreferredVersionName } =
    useDocsPreferredVersion();

  function getItems() {
    const versionLinks = versions.map((version) => {
      // We try to link to the same doc, in another version
      // When not possible, fallback to the "main doc" of the version
      const versionDoc =
        activeContext?.alternateDocVersions[version.name] ||
        getVersionMainDoc(version);
      return {
        active: version.name === activeContext?.activeVersion?.name,
        label: version.label,
        href: versionDoc.path,
      };
    });
    return versionLinks;
  }

  const dropdownVersion =
    activeContext.activeVersion ?? preferredVersion ?? latestVersion; // Mobile dropdown is handled a bit differently

  const items = getItems();
  return (
    <SimpleDropdown
      position={position}
      items={items}
      label={dropdownVersion.label}
    />
  );
};
