require=function e(r,t,n){function o(s,i){if(!t[s]){if(!r[s]){var u="function"==typeof require&&require;if(!i&&u)return u(s,!0);if(a)return a(s,!0);var c=new Error("Cannot find module '"+s+"'");throw c.code="MODULE_NOT_FOUND",c}var l=t[s]={exports:{}};r[s][0].call(l.exports,function(e){var t=r[s][1][e];return o(t?t:e)},l,l.exports,e,r,t,n)}return t[s].exports}for(var a="function"==typeof require&&require,s=0;s<n.length;s++)o(n[s]);return o}({1:[function(e,r,t){function n(e){return/^(GET|HEAD|OPTIONS|TRACE)$/.test(e)}function o(e){var r=null;if(document.cookie&&""!=document.cookie)for(var t=document.cookie.split(";"),n=0;n<t.length;n++){var o=jQuery.trim(t[n]);if(o.substring(0,e.length+1)==e+"="){r=decodeURIComponent(o.substring(e.length+1));break}}return r}$.ajaxSetup({beforeSend:function(e,r){if(!n(r.type)&&!this.crossDomain){var t=o("csrftoken");e.setRequestHeader("X-CSRFToken",t)}}}),r.exports={get_cookie:o}},{}],2:[function(e,r,t){function n(e){function r(){a.getJSON(e.url).success(function(e){e.finished?e.success?t.resolve():t.reject({message:e.error}):setTimeout(r,2e3)}).error(function(e){if(console.error("Error polling task:",e),failures-=1,failures>0)setTimeout(r,2e3);else{var n=e.responseJSON.detail||e.statusText;t.reject({message:n})}})}var t=a.Deferred();return setTimeout(r,2e3),t}function o(e){var r=a.Deferred();return $.ajax({method:"POST",url:e,success:function(e){n(e).then(function(){r.resolve()}).fail(function(e){r.reject(e)})},error:function(e){var t=e.responseJSON.detail||e.statusText;r.reject({message:t})}}),r}var a=e("jquery");r.exports={poll_task:n,trigger_task:o}},{jquery:"jquery"}],"core/projectimport":[function(e,r,t){function o(e,r){var t=this;t.id=u.observable(e.id),t.name=u.observable(e.name),t.slug=u.observable(e.slug),t.active=u.observable(e.active),t.avatar_url=u.observable(i(e.avatar_url,{size:32})),t.display_name=u.computed(function(){return t.name()||t.slug()}),t.filtered=u.computed(function(){var e=r.filter_org();return e&&e!=t.id()})}function a(e,r){var t=this;t.id=u.observable(e.id),t.name=u.observable(e.name),t.full_name=u.observable(e.full_name),t.description=u.observable(e.description),t.vcs=u.observable(e.vcs),t.organization=u.observable(),t.html_url=u.observable(e.html_url),t.clone_url=u.observable(e.clone_url),t.ssh_url=u.observable(e.ssh_url),t["private"]=u.observable(e["private"]),t.active=u.observable(e.active),t.avatar_url=u.observable(i(e.avatar_url,{size:32})),t.import_repo=function(){var e={name:t.name(),repo:t.clone_url(),repo_type:t.vcs(),description:t.description(),project_url:t.html_url()},n=c("<form />");n.attr("action",r.urls.projects_import).attr("method","POST"),Object.keys(e).map(function(r){var t=c("<input>").attr("type","hidden").attr("name",r).attr("value",e[r]);n.append(t)});var o=f.get_cookie("csrftoken"),a=c("<input>");a.attr("type","hidden").attr("name","csrfmiddlewaretoken").attr("value",o),n.append(a),n.submit()}}function s(e,r){var t=this;t.urls=r||{},t.error=u.observable(null),t.is_syncing=u.observable(!1),t.page_count=u.observable(null),t.page_current=u.observable(null),t.page_next=u.observable(null),t.page_previous=u.observable(null),t.filter_org=u.observable(null),t.organizations_raw=u.observableArray(),t.organizations=u.computed(function(){var e=[],r=t.organizations_raw();for(n in r){var a=new o(r[n],t);e.push(a)}return e}),t.projects=u.observableArray(),u.computed(function(){var e=t.filter_org(),r=(t.organizations(),t.page_current()||t.urls["oauthrepository-list"]);e&&(r=i(r,{org:e})),c.getJSON(r).success(function(e){var r=[];t.page_next(e.next),t.page_previous(e.previous);for(n in e.results){var o=new a(e.results[n],t);r.push(o)}t.projects(r)}).error(function(e){var r=e.responseJSON.detail||e.statusText;t.error({message:r})})}),t.get_organizations=function(){c.getJSON(t.urls["oauthorganization-list"]).success(function(e){t.organizations_raw(e.results)}).error(function(e){var r=e.responseJSON.detail||e.statusText;t.error({message:r})})},t.sync_projects=function(){var e=t.urls.api_sync_github_repositories;t.error(null),t.is_syncing(!0),l.trigger_task(e).then(function(e){t.get_organizations()}).fail(function(e){t.error(e)}).always(function(){t.is_syncing(!1)})},t.next_page=function(){t.page_current(t.page_next())},t.previous_page=function(){t.page_current(t.page_previous())},t.set_filter_org=function(e){var r=t.filter_org();r==e&&(e=null),t.filter_org(e)}}function i(e,r){var t=c("<a>").attr("href",e).get(0);return Object.keys(r).map(function(e){t.search&&(t.search+="&"),t.search+=e+"="+r[e]}),t.href}var u=e("knockout"),c=e("jquery"),l=e("./tasks"),f=e("./django-csrf.js");c(function(){var e=c("#id_repo"),r=c("#id_repo_type");e.blur(function(){var t,n=e.val();switch(!0){case/^hg/.test(n):t="hg";break;case/^bzr/.test(n):case/launchpad/.test(n):t="bzr";break;case/trunk/.test(n):case/^svn/.test(n):t="svn";break;default:case/github/.test(n):case/(^git|\.git$)/.test(n):t="git"}r.val(t)})}),s.init=function(e,r,t){var n=new s(r,t);return n.get_organizations(),u.applyBindings(n,e),n},r.exports.ProjectImportView=s},{"./django-csrf.js":1,"./tasks":2,jquery:"jquery",knockout:"knockout"}]},{},[]);