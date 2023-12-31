import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useAnimationControls, useInView } from "framer-motion";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

import phoneImg from "@/images/iphone-dimension.png";
import footerPhoneImg from "@/images/iphone.png";

import sliderContactImg from "@/images/slider-contact.png";
import sliderReceivedImg from "@/images/slider-received.png";
import sliderSumImg from "@/images/slider-sum.png";

import "@/scripts/index";
import TransferCards from "@/components/TransferCards";
import { Layout } from "@/components/Layout";
import { useEffectWithoutFirstRender } from "@/helpers/useEffectOnlyOnce";
// import Model from "@/components/3D/Scene";
// import { OrbitControls, View } from "@react-three/drei";
// import { Canvas } from "@react-three/fiber";

const sliderImages = [sliderContactImg, sliderSumImg, sliderReceivedImg];

const transfersText = [
  {
    header: "Phone number is a User Identity",
    p: "Automatically create a crypto wallet or add your existing one and link it with your phone number. Of course, you can switch to the username if you want to.",
  },
  {
    header: "Transfer to friends directly from messages",
    p: "Find your friends in the contact list and send crypto simple as a message. View the history of transfers with your friends in a form of a chat.",
  },
  {
    header: "Simple Protocol",
    p: "Transfer crypto from and to any network in any asset. We will cover everything for you.",
  },
  {
    header: "Pay by a debit card in crypto",
    p: "Issuing a Simple debit card and pay with your cryptocurrencies anywhere",
  },
  // {
  //   header: "Receive payments for self-employed",
  //   p: "Accept payments in crypto in any situation you want.",
  // },
  // {
  //   header: "Seamless fiat to crypto conversion",
  //   p: "Send crypto and receive fiat money just in one transaction.",
  // },
];

const sectionAnimation = {
  hidden: {
    y: 150,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6 },
  },
  viewPort: {
    amount: 0.2,
    once: true,
  },
};

const sectionAnimationProps = {
  variants: sectionAnimation,
  initial: "hidden",
  whileInView: "visible",
  viewport: sectionAnimation.viewPort,
};

const sideHeaderAnimation = {
  hidden: (custom) => ({
    x: custom.x, // set -x value to start from left side and x to start from right side
    opacity: 0,
  }),
  visible: (custom) => ({
    x: 0,
    opacity: 1,
    transition: { duration: 1, delay: custom.delay },
  }),
};

const howItWorksCardAnimation = {
  empty: {
    width: 0,
    borderRadius: "15px 0px 0px 15px",
  },
  filled: {
    width: "100%",
    backgroundColor: "#5356D9",
    transition: { duration: 6, ease: "linear" },
    borderRadius: "15px",
  },
  filledInstant: {
    width: "100%",
    backgroundColor: "#5356D9",
    transition: { duration: 1, ease: "linear" },
    borderRadius: "15px",
  },
};

const cardImageAnimation = {
  hidden: {
    opacity: 0,
    display: "none",
  },

  visible: {
    opacity: 1,
    display: "block",
    transition: { duration: 2 },
  },
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function Home() {
  const router = useRouter();

  const cardContainerRef = useRef();
  const cardContainerInView = useInView(cardContainerRef);

  const [number, setNumber] = useState();
  const [sliderActiveIndex, setSliderActiveIndex] = useState();

  const cardControls = {
    first: useAnimationControls(),
    second: useAnimationControls(),
    third: useAnimationControls(),
  };

  const imageControls = {
    first: useAnimationControls(),
    second: useAnimationControls(),
    third: useAnimationControls(),
  };

  const handlePhoneWaitlistSubmit = (type) => (event) => {
    const myForm =
      type === "mobile"
        ? document.getElementById("form-container")
        : event.target.parentNode;
    const formData = new FormData(myForm);

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData).toString(),
    })
      .then(() =>
        alert(
          "Success! We have received your phone number and added you to our waitlist. We will be in touch as soon as the app becomes available."
        )
      )
      .catch((error) => alert(error));
  };

  useEffect(() => {
    if (process.browser) {
      const navbar = document.getElementById("landing-nav");

      document.addEventListener("scroll", navbarControl);

      function navbarControl() {
        if (scrollY > 75) {
          navbar.classList.add("navbar-background");
        } else {
          navbar.classList.remove("navbar-background");
        }
      }
    }
  }, []);

  useEffect(() => {
    const animation = async () => {
      setSliderActiveIndex(0);
      await cardControls.first.start("filled");

      setSliderActiveIndex(1);
      await cardControls.second.start("filled");

      setSliderActiveIndex(2);
      await cardControls.third.start("filled");
    };
    if (cardContainerInView) {
      animation();
    }
  }, [cardContainerInView]);

  useEffect(() => {
    const animation = async () => {
      switch (sliderActiveIndex) {
        case 0:
          imageControls.second.set("hidden");
          imageControls.third.set("hidden");
          imageControls.first.start("visible");

          cardControls.third.start("empty");
          cardControls.second.start("empty");
          await cardControls.first.start("empty");
          cardControls.first.start("filled").then(() => {
            setSliderActiveIndex(1);
          });
          break;

        case 1:
          imageControls.first.set("hidden");
          imageControls.third.set("hidden");
          imageControls.second.start("visible");

          cardControls.first.start("filledInstant");
          cardControls.third.start("empty");
          await cardControls.second.start("empty");
          cardControls.second.start("filled").then(() => {
            setSliderActiveIndex(2);
          });
          break;

        case 2:
          imageControls.second.set("hidden");
          imageControls.first.set("hidden");
          imageControls.third.start("visible");

          cardControls.first.start("filledInstant");
          cardControls.second.start("filledInstant");
          cardControls.third.start("filled");
          break;

        default:
          break;
      }
    };
    animation();
  }, [sliderActiveIndex]);
  return (
    <>
      <Head>
        <title>simple</title>
        <meta
          name="description"
          content="Simple way to transfer assets with zero crypto knowledge"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <Layout>
        <section class="hero-container">
          <div class="key-visual-container">
            <motion.h1
              variants={sideHeaderAnimation}
              custom={{ x: -550 }}
              initial="hidden"
              animate="visible"
              class="header"
            >
              Crypto Payments
              <br />
              for people
            </motion.h1>
            {/* <form id="contact-container"> */}
            {/* <input class="tel" type="tel" placeholder="Your phone number" /> */}
            <motion.a
              variants={sideHeaderAnimation}
              custom={{ x: -550, delay: 0.5 }}
              initial="hidden"
              animate="visible"
              target="_blank"
              rel="noreferrer"
              href="https://app.sympl.money/"
              class="button"
            >
              Try demo
            </motion.a>
            {/* </form> */}
          </div>
          <motion.div
            variants={sideHeaderAnimation}
            custom={{ x: 550 }}
            initial="hidden"
            animate="visible"
            class="phone-decoration-container"
          >
            {/* <Suspense fallback={"loading"}>
              <Canvas camera={{ position: [1, 1, 1] }}>
                <OrbitControls>
                  <Model />
                </OrbitControls>
                <color attach="background" args={["hotpink"]} />
              </Canvas>
            </Suspense> */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Image key={phoneImg} class="phone-decoration" src={phoneImg} />
            </motion.div>
          </motion.div>
        </section>

        <motion.section {...sectionAnimationProps} class="work-container">
          <p class="anchor" id="work"></p>
          <div class="item-container">
            <h1 class="header">How it works</h1>
            <div ref={cardContainerRef} class="cards-container">
              <div className="card-item" onClick={() => setSliderActiveIndex(0)}>
                <motion.div
                  variants={howItWorksCardAnimation}
                  initial="empty"
                  animate={cardControls.first}
                  class="background-decorator"
                ></motion.div>
                <p className="card-item-text">Select the contact from the list</p>
              </div>
              <div className="card-item" onClick={() => setSliderActiveIndex(1)}>
                <motion.div
                  variants={howItWorksCardAnimation}
                  initial="empty"
                  animate={cardControls.second}
                  class="background-decorator"
                ></motion.div>
                <p className="card-item-text">Select the amount for a transfer</p>
              </div>
              <div className="card-item" onClick={() => setSliderActiveIndex(2)}>
                <motion.div
                  variants={howItWorksCardAnimation}
                  initial="empty"
                  animate={cardControls.third}
                  class="background-decorator"
                ></motion.div>
                <p className="card-item-text">Transfer assets</p>
              </div>
            </div>
            <div class="image-wrapper">
              <motion.div
                variants={cardImageAnimation}
                initial="hidden"
                animate={imageControls.first}
              >
                <Image priority={true} src={sliderImages[0]} draggable="false" />
              </motion.div>
              <motion.div
                variants={cardImageAnimation}
                initial="hidden"
                animate={imageControls.second}
              >
                <Image priority={true} src={sliderImages[1]} draggable="false" />
              </motion.div>
              <motion.div
                variants={cardImageAnimation}
                initial="hidden"
                animate={imageControls.third}
              >
                <Image priority={true} src={sliderImages[2]} draggable="false" />
              </motion.div>
            </div>
          </div>
        </motion.section>

        <motion.section {...sectionAnimationProps} class="functional-container">
          <p class="anchor" id="about-us"></p>
          <h1 class="header">Transfers made simple</h1>
          <div class="functional-item-container">
            <TransferCards textArray={transfersText} />
          </div>
        </motion.section>

        <motion.section
          {...sectionAnimationProps}
          id="get-app"
          class="get-app-wrapper"
        >
          <div class="get-app-container">
            <div class="item-container">
              <h1 class="header">Get the app</h1>
              <p class="paragraph">
                Leave your phone number — we will send a link to the app
              </p>
              <form
                name="phoneWaitlist"
                method="post"
                data-netlify="true"
                id="form-container"
              >
                <input type="hidden" name="form-name" value="phoneWaitlist" />
                <PhoneInput
                  className="tel"
                  placeholder="+971 50 060 600"
                  value={number}
                  onChange={setNumber}
                  name="phone"
                />
                <button class="button" onClick={handlePhoneWaitlistSubmit("pc")}>
                  Get link
                </button>
              </form>
              <button
                className="mobile-button"
                onClick={handlePhoneWaitlistSubmit("mobile")}
              >
                Get link
              </button>
              <p class="policy">
                By clicking the button, you consent to the processing of personal
                data in accordance with the rules for the
                <Link target="_blank" href="/privacy-policy">
                  <b>&nbsp;the privacy policy.</b>
                </Link>
              </p>
            </div>
            <div class="decoration-container">
              <Image class="decoration-item" src={footerPhoneImg} alt="" />
            </div>
          </div>
        </motion.section>
      </Layout>
      {/* <main className={styles.main}>
        <div className={styles.description}>
          <p>
            Get started by editing&nbsp;
            <code className={styles.code}>src/pages/index.js</code>
          </p>
          <div>
            <a
              href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              By{" "}
              <Image
                src="/vercel.svg"
                alt="Vercel Logo"
                className={styles.vercelLogo}
                width={100}
                height={24}
                priority
              />
            </a>
          </div>
        </div>

        <div className={styles.center}>
          <Image
            className={styles.logo}
            src="/next.svg"
            alt="Next.js Logo"
            width={180}
            height={37}
            priority
          />
          <div className={styles.thirteen}>
            <Image
              src="/thirteen.svg"
              alt="13"
              width={40}
              height={31}
              priority
            />
          </div>
        </div>

        <div className={styles.grid}>
          <a
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={inter.className}>
              Docs <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              Find in-depth information about Next.js features and&nbsp;API.
            </p>
          </a>

          <a
            href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={inter.className}>
              Learn <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              Learn about Next.js in an interactive course with&nbsp;quizzes!
            </p>
          </a>

          <a
            href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={inter.className}>
              Templates <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              Discover and deploy boilerplate example Next.js&nbsp;projects.
            </p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={inter.className}>
              Deploy <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              Instantly deploy your Next.js site to a shareable URL
              with&nbsp;Vercel.
            </p>
          </a>
        </div>
      </main> */}
    </>
  );
}
