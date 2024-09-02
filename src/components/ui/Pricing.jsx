'use client'
import { Badge } from "../ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Check } from "lucide-react";
import PaymentLink from "./PaymentLink";
import { useUser } from "../../contextApi/UserContext";

const pricingList = [
	{
		title: "Basic",
		popular: 0,
		price: 10,
		description: "Lorem ipsum dolor sit, amet ipsum consectetur adipisicing elit.",
		buttonText: "Get Started",
		benefitList: ["1 Team member", "2 GB Storage", "Upto 4 pages", "Community support", "lorem ipsum dolor"],
		paymentLink:process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PLAN_LINK,
		billing: "/month",
	},
	{
		title: "Premium",
		popular: 1,
		price: 50,
		description: "Lorem ipsum dolor sit, amet ipsum consectetur adipisicing elit.",
		buttonText: "Buy Now",
		benefitList: ["4 Team member", "4 GB Storage", "Upto 6 pages", "Priority support", "lorem ipsum dolor"],
		paymentLink: process.env.NEXT_PUBLIC_STRIPE_HALF_YEARLY_PLAN_LINK,
		billing: "/6 month",
	},
	{
		title: "Enterprise",
		popular: 0,
		price: 99,
		description: "Lorem ipsum dolor sit, amet ipsum consectetur adipisicing elit.",
		buttonText: "Buy Now",
		benefitList: ["10 Team member", "8 GB Storage", "Upto 10 pages", "Priority support", "lorem ipsum dolor"],
		// href: "/api/auth/login",
		paymentLink: process.env.NEXT_PUBLIC_STRIPE_YEARLY_PLAN_LINK,
		billing: "/year",
	},
];

export const Pricing = () => {
	const { user } = useUser();
	
	if (!user || user?.plan === "free") {
		return (
			<section id='pricing' className='container py-24 sm:py-32'>
				<h2 className='text-3xl md:text-4xl font-bold text-center'>
					Get
					<span className='bg-gradient-to-b from-[#667EEA] to-[#764BA2] uppercase text-transparent bg-clip-text'>
						{" "}
						Unlimited{" "}
					</span>
					Access
				</h2>
				<h3 className='text-xl text-center text-muted-foreground pt-4 pb-8'>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias reiciendis.
				</h3>
				<div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
					{pricingList.map((pricing) => (
						<Card
							key={pricing.title}
							className={
								pricing.popular === 1
									? "drop-shadow-xl shadow-black/10 dark:shadow-white/10"
									: ""
							}
						>
							<CardHeader>
								<CardTitle className='flex item-center justify-between'>
									{pricing.title}
									{pricing.popular === 1 ? (
										<Badge variant='secondary' className='text-sm text-primary'>
											Most popular
										</Badge>
									) : null}
								</CardTitle>
								<div>
									<span className='text-3xl font-bold'>${pricing.price}</span>
									<span className='text-muted-foreground'> {pricing.billing}</span>
								</div>

								<CardDescription>{pricing.description}</CardDescription>
							</CardHeader>

							<CardContent>
								<PaymentLink
									// href={`${pricing.paymentLink}`}
									// href={`${pricing.paymentLink}`}
									text={pricing.buttonText}
									paymentLink={pricing?.paymentLink}
								/>
							</CardContent>

							<hr className='w-4/5 m-auto mb-4' />

							<CardFooter className='flex'>
								<div className='space-y-4'>
									{pricing.benefitList.map((benefit) => (
										<span key={benefit} className='flex'>
											<Check className='text-purple-500' /> <h3 className='ml-2'>{benefit}</h3>
										</span>
									))}
								</div>
							</CardFooter>
						</Card>
					))}
				</div>
			</section>
		);
	}
};