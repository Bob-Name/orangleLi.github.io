import Vue from 'Vue';
import normalListView from './normalListView.vue';
import fastclick from 'fastclick';
import VueLazyLoad from 'vue-lazyload';
import {get, post} from '@/axios/api';

import wxModal from '@/base/wxModal/index.js';
import loading from '@/base/loading/loading.js';
import storage from '@/common/js/localstorage.js'; // 引入公用js
import '@/common/js/rem.js';

import '@/common/css/reset.css';
import '@/common/css/common.css';
Vue.config.productionTip = false;

fastclick.attach(document.body);

Vue.use(VueLazyLoad, {
  loading: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAQG0lEQVR42uzayW7iQBSG0X7/dyQgxCBGgUEMElCtn1UW3ZsImyI+VzqbLF3XH9jkz2AwKEA/CQAIACAAgAAAAgAIACAAgAAAAgAIACAAgAAAAgAIACAAgAAAAgAIACAAgAAAAgAIACAAgAAAAgAIACAAgAAAAgAIACAAgAAAAgAIACAAgAAAAgC9JwAgAIAAAAIACAAgAIAAAAIACAAgAJ9lMpmU9XpdmqYp5/O53G638ng8yvfJ367Xazkej2W73Zb5fF6Gw2HvF+UT5dxyfjnHnGfONef7bXL++Vv2IXuR/cieCMBvuun3+/3zkH86WZLT6VSWy6UYfMBNn3PKeeXcfjjZl+xN9kcAPtFsNntW/dVzv9/Lbrcro9Go9zdbTXIeOZecz4sne5R9EoBPMB6Pn/Vve/LpstlsytfXV+9vvnfK9c855DxanuxV9ksAapWvflmEDifPlVmK3t+I74p9rn+Hk/3KnglAbfK89qbJUuRlU+9vyC7leufr/psm+yYAtTgcDqWGWSwWvb8xu5DrXMFk7wSghk/+iiYvi3p/g7ZpOp3+6zHPN4E+BmC1WpXKJj8f+YWgxTf9ub6VTfZQAN7xAiifBDVO0zS9v1nbkOta4WQPs48C0KX8JFPx+GWgheBXPNlHAejyDfB/xrPhL5V/8ql8spcC0IXL5VIqnzyr9v6mfaVcz8one/mXvbPZTSWGwSjv/45dAALBihUSgsVUp+pUEaJiWiej8eQcyYvb285/vsSJYysAc8T2J4EZ6+4bbmfvnGtVAFov+yWBnWXdN97Kqz26fr0LwMShoIEizv7r+q1NAPb7/VCgT/gPc86nOXynCkDvQ8Hv9eHuG28Fexfzb2BQwDb6/23ZbrfdN+CI8fy+cR6gdwEg2CIbp9Op+0YcMZ7fCwwK6lEA7vf7kAwCWLpvxNEAoGTwnSoA+oI/s8JmDQpk+3k8HkMy+E4VgBaWFDLIdN+YA/v+M6IAKABuEQ5m9+W5KQAKQGoBKDPL6gpMH/qPGZ0VAAUgvQCUgUGOBN4n/RgbvwKgAKxGAEp3wNyBv/v847BfAVAAAgKQYzRgJuEiv0MR7qsAKAABAci3Zsyuwd5cA+6X+54a22EIuALwEcgBmOKjoYAlw+C11h/kvrg/7vMv79I4AAUgHAiUMZyUklckmMi6esB1jxWZXxXrVAAUAAXgD9WJKXNNbPxSNxhxXVwf1/lbg1cAFAAFoNJHNta0p8ExtKa3pRG2GjFwXI7PeTgf5+X8XIfvRgFQAJa23EjhTBrn9XolOxHbVNlcQ8P9MYbn5b/5f36P3+fv+HuOw/FkEuxfUABaGA9WRAFwO7CI24F7EwCGoiILh+9UAWhh+KMiCTZ+KQCmBJNKmBJMAfiyrwgykYXDd6oAtDCWpkQKLA8ftI0VYkSqJ4JVAMwQK51CQJUC0MIul8sgYlHYTgWA3XEiZoG2NqCI1aAq2MYyUSJ1ORwOCkALOx6Pg8jS2e12CkALo+66yMIh36EC0CqRpIgJQSsLgJmBRarlAlAAGpqZacSdgLUFwJwAItU2AikALY08dSLuA+hUAEhYKWIYcEUBMBxYpArUOVQAjAYUg4AUgCZGUQqRhULxFAWgdYFJEWMAKgqAsQAiYVihUgBMDy4LLr/OJDLbykkuQ49dewlQATA3oCwwOu9VRWX8dYSgZiIQBWAOY61VZGKVHhr6HLkmmaBWAOYwEi6ITIAcElMmlqk8HXUxEBoFwJUAyVenP1505na7cRwFwErBkm5ZLj6vRIi6ApC9ShC+IDPEDOckEfFhOUt40QlABSB5hmBe4hhtaKxBP7H5uJSIRTQEWAFInh+wrOnGspFuRh+VeqNLgXQWHEcBmNuY5KkMwlL2DJYkzwsC/rZnZtQXBHdUAVhJchA+mjKrKz6kOQiS9vwIePkez+czIzt+jptXax4Jd1QBWFFAEEs6iMBzT+HkYA4Y0j9H/NFZuAV4ZQLAg285fMQdeD6fLsEne/ea3DYORGF0/7uL47ycZA3ZgqbOD0x1dUiJsqVIJC6quiYjiSIo435odOPx3C5/n/gD5KYC3/Oe7hMAPMjkeu+ZRlpy77iSyRI8V7rPIp+e8pMB8He6t7cRABx8j0C9vrFjTx3542dY8Ngic7P0t/F6zgG8FgBZF3B2WunSZA+NL6sTHxPkW1p8YwhwH69wPf0XAEy0QYiGtxT08VpA8DjhG+v7/bMF+HsAkGHA9WPOP3/+GHMugUB9MjS4/YEbhL+Wy39ETEZ9AoCJlweLANulePUgU5Dgjqa8e9ill11NsxGglO2Zkuj/tQDI6sB3uaU1ZdgNJHKi0fZC1Hr14mE93N3vBdwDgOwS9NeU0N5b9YYrXZXzDZeX7sqqXPr9eASPHl65v7oEAE9k/iDPMO5WBzEA2YFLk5j0ImAws+gJ+uJYWlrPb2VI8MDS5/4HANks9CwI1GfLNFGwMOHIMMF1R56wY1YeL8iQaQvUeQWXhJ/gXwBQpgY/ZwR764QR414NjEjEFjT+vQueiOXn18b05zIpOf8/ALjKiG0/wa3tYHMdUWiAoPCMYvd8vB7eDIhd+5ym7j77WgsgCwByduCH01vE/BFX0rBBYyQ242jgI0D58HvWW8zCUEX9BV6JFqA+8hx7SJfWjT8DgHgBNysExd2/5ZJSPa/xs3E2SEhD8iAI1r0Ibsm85zM+6xrXghSR+s5bBmyBa2mVXnr/AOAmsQAu6R7z3zVAdiQDEXDh4ufcvwDgAdOD95ci8wx64rGzzZ6Mx2B4YHjCy9l79kKnEgDsyIjmSGv2iQgQ7EXwjI2RWw9WIv5c+3t7YFn0EwBcNGI58jx5QgMFY3ZpRm72vxC6e7knYXDpgfbIk5V0JgFANg7djbtqXQRhmrGmRx5HYgMit1wwixEyG//vvRowdK20nu/igYBOzhYMAHYXfMr2XSkfOe4rANi76dlSUt5xrHgAcBQzXk1J2RhfGYHWAOAohuaCZikpF8rY5CUAOJiJYGeHnpQtG30EAAc1rl2CginnDocNAI5u5rcb56WktKm+AcAkJv+dnXtThvjFiAKAeAIpE243PsQfAExoVt4lJpAxfwAwsZktmJ165yqmR0/f7gOANk+AO5hy+Ek+8vzTt/cAYNksmklw8LgHjkgDT9/GA4DLcYEMCY5VrGzk5U3ftgOA7UMCs8LiDey7WBot5Tt9ew4APjBz0Hr4lF0V4BboS68fANzGBI70Jim7yO3L7EzfZgOA2w8L7JaTBUXPWXhqJndN304DgPuDQLYgHsHzTOWN8AOAh+02lBjB405XSlovAHia1KFdhzKt+P5bddmw1E6907e5AOA5zU6yduRNCvF2qTx5/PT2AcDuYgVgwFVN4PD6WXvmYWRsHwAcapjAfZWmylDh717e6jxZFlu3Td9WAoAJbJz7r+Hr8SYYMtRTjcRMzK+I4AOAWIWCE3zqmf8Es8PCyyF08RDuPLFngk4AEDsXMwAAIhlR7t+/f59+/vzpv3pKY2JCMg+hHt0lxsCD+NfHj7m/eqiPepl3r57qy8ZBrV7zbCzTcwOAWBc+YY/z+sQKQIBoOgjYjx8/Tt+/fz99+/bt9PXr19OXL19Or6+vp8+fPzP/9rrPDXjU+43vrea17oq7btzPvcZ9mH+7h9fVZdyLdeF7Fs80ziEcoAgIAoAYYeg9xQLq4Z2A0EFAMMT169evE6G9vb0twqAKFRBeXl7+t0+fPp2z+lnXVsEviV4d1EWd1E0du/AH3DybZxyHjzLvT98GAoB51xUY6xsfW7lGEBUE1SPgOnevoMKgA6FCoYBhs7mmir0Lvoq+9/bqWnv8LnzP6pk9+4j8T98eAoB5jFhGkE+AzDyBLSDQky7BAEwqEDoUBhiqEXS1/r5rutir4N1zSfTquEX4ntmz+w3EEryWIUEAMIX4NXpTWkXINf5zIBjDA+PmSzAYQKhQGGBgBRCrVj9bvZUaK7gkenVVZ3W/JHy/gd9CUNGinkAgADj8AaXSeqL2Gv0SCLjFxCK6TjhENGCgR60w6ECoUKhg6IDo1gVehV7F3gVfRa9uQ/RM3T3DcPXXhO+3GKlOEJi+nQQAxzQCqKm0NRAQwQCBHnMNBnrZCoQOhQGGCocKiWr9fdcMoXexV8Grw5ro1X0I3zOtCb+nL10/fVsJAA5mhFJKB4FJMwMEJv8QCtHoMddgwLXuQBhQGGDocLhkXeRD6EPsXfDqsCZ6dfcMnsUzDeF71i78XtRj+jYTABznWPIts/kGCPSMFQZ6zgqDNSBUKFQwsAGILVav8R1d7KuCr6JX5yp6zzSEv6H4fOIBAcAhjECunWm3BgO96RoQKhQGGFgFRAVFtf5+vdZ3VbGvCV7d1kTvmXJWfwAw50SfVm4Bgw6ECoUKhg6ICopq/f1+ve+sYu+Cv5Xo+7NnoVAAMEHv/zEgdCgMMAw4VEBsMZ+tIh9C72J/j+DjBQQAU4397yGKDoQKhQGGDoerrYt8CL2Knd25uF9iAQHAPk3g7FGlw6EbYVXr71eRP7j8x9694zgOAwEQvf8hHfkiOxVs4mTgtbgm1a+BwgRj6we6JJHNpsU8CeBMemQWH0d9EOPbEgEc+PgvLnuS8RpAAOcl/oi3Q2IQAdwn7Vd8FNKDCeBYlAG/NhqKHN+mCMD7v36Ah/ZFAAesDCQuDysDEcAZNIlGyAcggKE0cUZcHk1aGt+2COAAyqcXl0fzKsa3LQI4gPLohZEAApiJZcHXREOr49sWARxQ+FMsGwoc374IYHOqoCuWRZWLx7cxAtiYKukKuQAEIAlIXB+VKB/fxghgY0pWEcuicuXj2xgBmAb8E7IBQQDSgGeFlYQJQB3AwdH1Hd/GCGBjKmMtzAcgAALYOqr6G38X6IwFYZ0AAphFpau+HJX5blGPZiX2yFzHWfkJFSr5rahG/+9zfb7v9f220/baLgEQADabCtzdu2W76iBbnSjT9ttP+2u/agMSAL4kgGYdtmz3t0pltd/2/z9nP3Z9x7cxApgtgCbFNNy42/Bnx0UABEAAi3/8u6bDdlwdHwEQAAEMHQar05AACGAs/UBX3v13nw7b8XWc8gAIwFyAoSWxGjKUCkwAM3k+n+Mffxe+BnV9x7cxAtibVQkzDbmdcP4d56oEp/FtiwDmZgNWbuyUpdEkARHA6LUBr86S6726bcfEfoCuZ9d1fNsigJmdgeXmn1YbUecfAcgJGDwHvuM29k8ACoT847h43zv9ztfxf3L+CoAQwC1Khb/7Ttxsu7uUwO48Op93+zy6buPbDgHcSwT1ZJfQ093ttZOrRl+m211r33denV/n2fm+3u27Ll0fP3wCGLOMWKmz/XX+D+2BAAAQAAACAEAAAAgAAAEAIAAABACAAAAQAAACAEAAAAgAAAEAIAAABACAAIAHAYy/CAABACAA4E87dUgAAAAAIOj/a2dYCFwAAQACAAQACAAQACAAQACAAAABAAIABAAIABAAIABAAIAAgE8mDCDKl0HlIAAAAABJRU5ErkJggg==',
  error: 'data:image/png;base64,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'
});
Vue.use(wxModal);
Vue.use(loading);
Vue.prototype.$storage = storage; // 添加到vue属性中
Vue.prototype.$get = get;
Vue.prototype.$post = post;

/* eslint-disable no-new */
new Vue({
  el: '#normalListView',
  render: h => h(normalListView)
});