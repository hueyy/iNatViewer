(ns inatviewer.core
  (:require
   [reagent.core :as r]
   [reagent.dom :as rdom]
   [reitit.frontend :as rf]
   [reitit.frontend.easy :as rfe]
   [reitit.coercion.spec :as rss]
   [spec-tools.data-spec :as ds]
   [clojure.spec.alpha :as s]
   [fipp.edn :as fedn]))

(defonce match (r/atom nil))

(defn home-page [_state]
  [:div
   [:h1 "iNatViewer"]
   [:form {:action (rfe/href ::view) :method "GET"}
    [:input {:name "url" :placeholder "URL" :value "https://www.inaturalist.org/observations?q=huey.xyz&user_id=hueyl"}]
    [:button {:type "submit"} "VIEW"]]])

(defn viewer [match]
  (let [{:keys [query]} (:parameters match)
        url (:url query)]
    [:div
     [:h1 "VIEWER"]
     [:p url]]))

(defn current-page []
  [:div
   [:ul
    [:li [:a {:href (rfe/href ::frontpage)} "Homepage"]]
    [:li [:a {:href (rfe/href ::view)} "Viewer"]]]
   (if @match
     (let [view (:view (:data @match))]
       [view @match])
     [:pre (with-out-str (fedn/pprint @match))])])

(def routes
  [["/"
    {:name ::frontpage
     :view home-page}]
   ["/view"
    {:name ::view
     :view viewer
     :parameters {:query (s/keys :req-un [::url])}}]])

(defn start {:dev/after-load true} []
  (rfe/start!
   (rf/router routes {:data {:coercion rss/coercion}})
   (fn [m] (reset! match m))
   {:use-fragment false})
  (rdom/render [current-page] (js/document.getElementById "app")))

(defn init []
  (start))
