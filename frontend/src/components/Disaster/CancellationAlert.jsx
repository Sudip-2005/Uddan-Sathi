import React from "react";

const CancellationAlert = ({
	message = "This flight has been cancelled",
	reason = "",
	time = "",
}) => {
	let formattedTime = "";
	try {
		if (time) formattedTime = new Date(time).toLocaleString();
	} catch (e) {
		formattedTime = time;
	}

	return (
		<div className="max-w-3xl mx-auto">
			<div
				role="alert"
				className="flex items-start gap-4 p-4 rounded-lg bg-red-50 border-l-4 border-red-600 shadow-sm"
			>
				<div className="flex-shrink-0">
					<svg
						className="h-6 w-6 text-red-600"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						aria-hidden="true"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
						/>
					</svg>
				</div>

				<div className="flex-1">
					<h3 className="text-sm font-semibold text-red-800">{message}</h3>
					{reason ? (
						<p className="mt-1 text-sm text-red-700">
							<span className="font-medium">Reason:</span> {reason}
						</p>
					) : null}
					{formattedTime ? (
						<p className="mt-1 text-xs text-red-600">Time: <span className="font-medium text-red-800">{formattedTime}</span></p>
					) : null}
				</div>

				<div className="hidden sm:flex sm:items-center">
					<span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-800">
						Cancelled
					</span>
				</div>
			</div>
		</div>
	);
};

export default CancellationAlert;

