import { notificationTypes, roles } from "../@data";
import { toast } from 'react-toastify';

export const humanRole = (role: any) => {
	return roles.find(i => i.value === role)?.name;
}

export const humanNotification = (notification: any) => {
	return notificationTypes.find(n => n.value === notification)?.name;
}

export const notifySuccess = (msg: string) => {
	toast.success(msg, {
		position: toast.POSITION.TOP_CENTER
	});
}

export const notifyError = (msg: string) => {
	toast.error(msg, {
		position: toast.POSITION.TOP_CENTER
	});
}

export const timeSince = (date: any) => {
	const seconds = Math.floor((new Date().valueOf() - date?.valueOf()) / 1000);

	let interval = Math.floor(seconds / 31536000);

	if (interval > 1) {
		return interval + " years";
	}
	interval = Math.floor(seconds / 2592000);
	if (interval > 1) {
		return interval + " months";
	}
	interval = Math.floor(seconds / 86400);
	if (interval > 1) {
		return interval + " days";
	}
	interval = Math.floor(seconds / 3600);
	if (interval > 1) {
		return interval + " hours";
	}
	interval = Math.floor(seconds / 60);
	if (interval > 1) {
		return interval + " minutes";
	}
	return Math.floor(seconds) + " seconds";
}

export const formatDate = new Intl.DateTimeFormat('en', {
	year: 'numeric',
	month: 'long',
	day: 'numeric',
	hour: 'numeric',
	hour12: true,
	minute: 'numeric'
});

export const getTime = new Intl.DateTimeFormat('en', {
	hour: 'numeric',
	hour12: true,
	minute: 'numeric'
});

export const groupByKey = (array: any[], key: string) => {
  return array.reduce((hash, obj) => {
    if (obj[key] === undefined) return hash;
    return Object.assign(hash, {
      [obj[key]]: (hash[obj[key]] || []).concat(obj),
    });
  }, {});
}

export const sortByDate = (arr: any[]) => {
	const newArr = [...arr];
	return newArr.sort((first, second) => (new Date(second.createdDate).getTime() - new Date(first.createdDate).getTime()));
};

export const setValue = (propertyPath: string, value: any, obj: any): any => {
  // this is a super simple parsing, you will want to make this more complex to handle correctly any path
  // it will split by the dots at first and then simply pass along the array (on next iterations)
	const properties: any = Array.isArray(propertyPath) ? propertyPath : propertyPath.split(".");

  // Not yet at the last property so keep digging
  if (properties.length > 1) {
    // The property doesn't exists OR is not an object (and so we overwritte it) so we create it
    if (!Object.prototype.hasOwnProperty.call(obj, properties[0]) || typeof obj[properties[0]] !== "object") obj[properties[0]] = {}
      // We iterate.
    return setValue(properties.slice(1), value, obj[properties[0]])
      // This is the last property - the one where to set the value
  } else {
    // We set the value to the last property
    obj[properties[0]] = value
    return true // this is the end
  }
}

export const paginate = (totalItems: number, currentPage = 1, pageSize = 10, maxPages = 100) => {
	// calculate total pages
	const totalPages = Math.ceil(totalItems / pageSize);

	// ensure current page isn't out of range
	if (currentPage < 1) {
		currentPage = 1;
	} else if (currentPage > totalPages) {
		currentPage = totalPages;
	}

	let startPage: number, endPage: number;
	if (totalPages <= maxPages) {
		// total pages less than max so show all pages
		startPage = 1;
		endPage = totalPages;
	} else {
		// total pages more than max so calculate start and end pages
		const maxPagesBeforeCurrentPage = Math.floor(maxPages / 2);
		const maxPagesAfterCurrentPage = Math.ceil(maxPages / 2) - 1;
		if (currentPage <= maxPagesBeforeCurrentPage) {
			// current page near the start
			startPage = 1;
			endPage = maxPages;
		} else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
			// current page near the end
			startPage = totalPages - maxPages + 1;
			endPage = totalPages;
		} else {
			// current page somewhere in the middle
			startPage = currentPage - maxPagesBeforeCurrentPage;
			endPage = currentPage + maxPagesAfterCurrentPage;
		}
	}

	// calculate start and end item indexes
	const startIndex = (currentPage - 1) * pageSize;
	const endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

	// create an array of pages to ng-repeat in the pager control
	const pages = Array.from(Array(endPage + 1 - startPage).keys()).map((i) => startPage + i);

	// return object with all pager properties required by the view
	return {
		totalItems,
		currentPage,
		pageSize,
		totalPages,
		startPage,
		endPage,
		startIndex,
		endIndex,
		pages,
	};
}