import React, { useEffect, useRef, useState } from "react";
import logo from "@/images/simple.svg";
import Image from "next/image";
import Link from "next/link";

import styles from "./layout.module.css";

export const Layout = ({ children }) => {
  const [navHeight, setNavHeight] = useState(0);
  const [resizeState, setResizeState] = useState(1);

  const ref = useRef();

  const onResize = () => {
    console.log(ref.current);
    setNavHeight(ref.current.offsetHeight + ref.current.offsetTop * 2);
    console.log(resizeState);
  };

  useEffect(() => {
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      setNavHeight(ref.current.offsetHeight + ref.current.offsetTop * 2);
    };
  }, []);

  return (
    <div className={styles.layoutContainer} style={{ paddingTop: `${navHeight}px` }}>
      <nav ref={ref} className={styles.navWrapper}>
        <div id="landing-nav" className={styles.navContainer}>
          <div className={styles.logoContainer}>
            <Image class={styles.logoImg} src={logo} />
            <span class={styles.logoText}>simple</span>
          </div>
          <div className={styles.navAnchorsContainer}>
            <a className={styles.navItem} href="#work">
              How it works
            </a>
            <a className={styles.navItem} href="#about-us">
              About Us
            </a>
            <Link
              className={`${styles.navItem} ${styles.navItemButton} ${styles.navItemMobileOnly}`}
              target="_blank"
              href="https://app.sympl.money/?ref=landing"
            >
              Web Demo
            </Link>
          </div>
          <div className={styles.decorateItem}>
            <Link
              className={`${styles.navItem} ${styles.navItemButton}`}
              target="_blank"
              href="https://app.sympl.money/?ref=landing"
            >
              Web Demo
            </Link>
          </div>
        </div>
      </nav>

      <div className={styles.mainContent}>{children}</div>

      <footer className="footer">
        <p>
          All rights are reserved by SIMPLE PROTOCOL TECHNOLOGIES LLC registered in
          SCHON BUSINESS PARK, DIP-1, Dubai, UAE, 346-019
        </p>
      </footer>
    </div>
  );
};
