/**
 * @copyright Copyright (c) 2021-2022 Andrey Borysenko <andrey18106x@gmail.com>
 *
 * @copyright Copyright (c) 2021-2022 Alexander Piskun <bigcat88@icloud.com>
 *
 * @author 2021-2022 Andrey Borysenko <andrey18106x@gmail.com>
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

import { generateUrl } from '@nextcloud/router'
import VueRouter from 'vue-router'
import Vue from 'vue'

const Collector = () => import('../views/Collector.vue')
const CollectorDetails = () => import('../views/CollectorDetails.vue')
const Resolved = () => import('../views/Resolved.vue')

Vue.use(VueRouter)

export default new VueRouter({
	mode: 'history',
	base: generateUrl('/apps/mediadc', ''),
	linkActiveClass: 'active',
	routes: [
		{
			path: '/',
			component: Collector,
			name: 'collector',
			props: (route) => ({
				rootTitle: t('mediadc', 'MediaDC'),
			}),
		},
		{
			path: '/tasks/:taskId',
			component: CollectorDetails,
			name: 'collectorDetails',
			props: (route) => ({
				rootTitle: t('mediadc', 'MediaDC Task Details'),
				taskId: route.params.taskId,
			}),
		},
		{
			path: '/resolved',
			component: Resolved,
			name: 'resolved',
			props: (route) => ({
				rootTitle: t('mediadc', 'MediaDC Resolved files'),
			}),
		},
	],
})
