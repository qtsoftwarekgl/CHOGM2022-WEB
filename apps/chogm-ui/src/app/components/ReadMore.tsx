import React, { useState } from "react";
interface ReadMoreProps {
	text: any,
	size?: number
	sendStatus?: (e: boolean) => void;
}
  
const ReadMore = (props: React.PropsWithChildren<ReadMoreProps>) => {
	const { text, size, sendStatus } = props;
	const value = size ? size : 150;
  const [isReadMore, setIsReadMore] = useState(true);
	const toggleReadMore = () => {
		sendStatus?.(!isReadMore);
    setIsReadMore(!isReadMore);
  };
  return (
		<>
			<p className="py-3 text-sm leading-5 text-gray-600 focus:outline-none" dangerouslySetInnerHTML={{ __html: isReadMore ? text.slice(0, value) : text }}></p>
			{text?.length > value && (
				<div className="text-right">
					<button onClick={toggleReadMore} className="px-3 py-2 text-sm text-white bg-blue-500 rounded cursor-pointer hover:bg-blue-300">
						{(isReadMore ? "Read more" : " Show less")}
					</button>
				</div>
			)}
		</>
  );
};

export default ReadMore;