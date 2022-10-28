/**
 * @copyright Copyright (c) 2022 Andrey Borysenko <andrey18106x@gmail.com>
 *
 * @copyright Copyright (c) 2022 Alexander Piskun <bigcat88@icloud.com>
 *
 * @author 2022 Andrey Borysenko <andrey18106x@gmail.com>
 *
 * @license AGPL-3.0-or-later
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

const state = {
	task: {},
	taskInfo: {
		exclude_directories: [],
		target_directories: [],
	},
	details: [],
	detailsInfo: {
		filessize: 0,
		filestotal: 0,
	},
	sortedDetails: [],
	detailsFiltered: [],
	detailsFilteredSorted: [],
	paginatedDetails: [],
	paginatedSortedDetails: [],
	paginatedDetailsFiltered: [],
	paginatedDetailsFilteredSorted: [],
	itemsPerPage: 5,
	groupItemsPerPage: 10,
	sorted: false,
	sortGroups: true,
}

const mutations = {
	setTask: jest.fn(),
	setTaskInfo: jest.fn(),
	setDetailsInfo: jest.fn(),
	setDetails: jest.fn(),
	deleteDetail: jest.fn(),
	setDetailsListItemsPerPage: jest.fn(),
	setGroupItemsPerPage: jest.fn(),
	setSorted: jest.fn(),
	setSortGroups: jest.fn(),
	setDetailsFiltered: jest.fn(),
}

const getters = {
	task: jest.fn(),
	taskInfo: jest.fn(),
	details: jest.fn(),
	detailsInfo: jest.fn(),
	sortedDetails: jest.fn(),
	detailsFiltered: jest.fn(),
	detailsFilteredSorted: jest.fn(),
	paginatedDetails: jest.fn(),
	paginatedSortedDetails: jest.fn(),
	paginatedDetailsFiltered: jest.fn(),
	paginatedDetailsFilteredSorted: jest.fn(),
	itemsPerPage: jest.fn(),
	groupItemsPerPage: jest.fn(),
	sorted: jest.fn(),
	sortGroups: jest.fn(),
}

const actions = {
	getTaskDetails: jest.fn(),
	getTaskInfo: jest.fn(),
	getDetailFilesTotalSize: jest.fn(),
}

export default { state, mutations, getters, actions }
