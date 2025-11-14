import React from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import kidsImage from "figma:asset/efb57fa65cd0ed6435b7a325b7bce684ff56d49f.png";
import youthImage from "figma:asset/948ef51074efa0a5c3a4bd84a2e188d01807e0c8.png";
import seniorImage from "figma:asset/a2fac2f316b024e99694889927cce46f4b049a3c.png";

export function ParticipantCategories() {
	const categories = [
		{
			title: "Kids Olympiad",
			subTitle: "प्रारंभिक आध्यात्मिक अनुशासन का विकास।",
			age: "upto 19 years",
			icon: kidsImage,
		},
		{
			title: "Youth Olympiad",
			subTitle: "आधुनिक जीवन में गीता सिद्धांतो का अनुप्रयोग।",
			age: "20 to 40 years",
			icon: youthImage,
		},
		{
			title: "Senior Olympiad",
			subTitle: "जीवन भर के आध्यात्मिक ज्ञान को गहरा करना।",
			age: "40+ years",
			icon: seniorImage,
		},
	];

	return (
		<section className="w-full px-4 sm:px-8 md:px-12 lg:px-20 pt-6 md:pt-8 pb-0 bg-[#fff9df]">
			<div className="max-w-7xl mx-auto relative">
				{/* Title positioned on top */}
				<div className="flex justify-center">
					<div className="bg-[#981a1d] text-white px-6 md:px-10 py-1 md:py-1 rounded-[25px] uppercase text-xl sm:text-sm md:text-2xl text-center font-bold">
						Participant Categories
					</div>
				</div>

				<div className="p-6 sm:p-8 md:p-12 pt-3 md:pt-4 pb-8 md:pb-12">
					<div className="flex flex-col sm:flex-row items-stretch gap-6 sm:gap-3 md:gap-4">
						{categories.map((category, index) => (
							<React.Fragment key={index}>
								<div className="flex-1 py-4 flex flex-col items-center text-center gap-1 md:gap-1">
									<img
										src={category.icon}
										alt={category.title}
										className="w-20 h-20 md:w-24 md:h-24 object-contain"
									/>
									<h3 className="text-[#dc4728] text-2xl md:text-2xl font-bold">
										{category.title}
									</h3>
									<p className="text-[#255a90] text-xl md:text-2xl font-medium">
										{category.age}
									</p>
									<p className="text-base md:text-lg text-black font-medium">
										{category.subTitle}
									</p>
								</div>
								{index < categories.length - 1 && (
									<div className="hidden sm:block w-px bg-gray-300 my-8" />
								)}
							</React.Fragment>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
