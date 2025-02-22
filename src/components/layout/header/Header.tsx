import React, { FC, useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Link as ScrollLink } from "react-scroll";
import { FormattedMessage } from "react-intl";
import scss from "./Header.module.scss";
import SwitchLogo from "@/components/theme/SwitchLogo";
import { LangIcon, ArrowIcon, PhoneIcon, TimeIcon } from "@/components/svgs";
import LanguageSwitcher from "@/components/language/LanguageSwitcher";
import Image from "next/image"

// impot {
// 	SwitchThemeButton,
// 	SwitchThemeIcon
// } from "@/components/theme/SwitchTheme";

import { IsOpenProps } from "@/components/layout/Layout";

interface HeaderProps extends IsOpenProps {}

interface linksProps {
	
	to: string;
	label: any;
	spy: boolean;
	smooth: boolean;
	offset: number;
	duration: number;
}
interface HeaderProps {
	
	logo: string;
	
}

const Header: FC<HeaderProps> = ({ logo, ...props }) => {
	const [headerScroll, setHeaderScroll] = useState<boolean>(false);
	const { locales, locale: activeLocale, pathname }: any = useRouter();

	// ! Scrolling Scroll
	useEffect(() => {
		const changeBackground = () => {
			if (window.scrollY >= 10) {
				setHeaderScroll(true);
			} else {
				setHeaderScroll(false);
			}
		};

		changeBackground();
		window.addEventListener("scroll", changeBackground);

		return () => {
			window.removeEventListener("scroll", changeBackground);
		};
	}, []);

	// ! Link Scroll
	const offsetScroll = -30;
	const durationScroll = 500;

	const links: linksProps[] = [
		{
			label: "Servicii",
			to: "/",
			spy: true,
			smooth: true,
			offset: offsetScroll,
			duration: durationScroll
		},
	
	
		{
			label: "Blog",
			to: "service",
			spy: true,
			smooth: true,
			offset: offsetScroll,
			duration: durationScroll
		},
		{
			label: "Despre noi",
			to: "about",
			spy: true,
			smooth: true,
			offset: offsetScroll,
			duration: durationScroll
		},
		{
			label: "Contact",
			to: "contact",
			spy: true,
			smooth: true,
			offset: offsetScroll,
			duration: durationScroll
		}
	];
	
	const handleScroll = () => {
		setTimeout(() => {
			window.scrollBy(0, 1);
		}, 570);
	};

	return (
		<div>
			<header className={scss.header}>
				<div
					className={
						headerScroll
							? `${scss.headerScroll} ${scss.active}`
							: `${scss.headerScroll}`
					}
				>
					<div className="container">
						<div className={scss.content}>
							{/* ! header menu */}
							<div className={scss.logo}>
						
									
								
								<Image src="/1.png" alt="Logo" width={100} height={50} />
								
							</div>
						
							<div className={scss.nav__menu}>
								<div className={scss.left}>
									<div className={scss.links}>
										{links.map((link, index) => (
											<ScrollLink
												key={index + 1}
												to={link.to}
												spy={link.spy}
												smooth={link.smooth}
												offset={link.offset}
												duration={link.duration}
												className={scss.link}
												activeClass={scss.active}
												onClick={() => {
													handleScroll();
												}}
											>
												{link.label}
											</ScrollLink>
										))}
									
									</div>
								</div>

								<div className={scss.right}>
									
								
									<div className={scss.timetable}>
										<div className={scss.icon__text}>
											<TimeIcon />
											<p className={scss.text}>
													09:00 - 16:00
											</p>
										</div>
									
									</div>
								</div>
							</div>

							{/* ! burger menu */}
							<div
								className={
									props.isOpen
										? `${scss.nav__burger__menu} ${scss.show}`
										: `${scss.nav__burger__menu}`
								}
							>
								{links.map((link, index) => (
									<ScrollLink
										key={index + 1}
										to={link.to}
										spy={link.spy}
										smooth={link.smooth}
										offset={link.offset}
										duration={link.duration}
										className={scss.link}
										activeClass={scss.active}
										onClick={() => {
											props.setIsOpen(false);
											props.setIsOpenDropdown(false);
											props.setIsOpenDropdownLanguage(false);
											handleScroll();
										}}
									>
										{link.label}
									</ScrollLink>
								))}

							
								<div className={scss.timetable}>
									<div className={scss.icon__text}>
										<TimeIcon />
										<p className={scss.text}>
											09:00 - 16:00
										</p>
									</div>
									<div className={scss.icon__text}>
										<PhoneIcon />
										<p className={scss.text}>+40-507-85-65</p>
									</div>
								</div>
							</div>

							<div className={scss.burger__button}>
								<div
									className={
										props.isOpen
											? `${scss.burger__icon} ${scss.open}`
											: `${scss.burger__icon} `
									}
									onClick={() => props.setIsOpen(!props.isOpen)}
								>
									<span />
								</div>
							</div>

							{/* <div className="burger__button">
								<label>
									<input
										type="checkbox"
										checked={isOpen}
										onChange={() => props.setIsOpen(!isOpen)}
									/>
									<span></span>
									<span></span>
									<span></span>
								</label>
							</div> */}
						</div>
					</div>
				</div>
			</header>
		</div>
	);
};
export default Header;
