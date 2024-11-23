(ns inatviewer.core
  (:require-macros [cljs.core.async.macros :refer [go]])
  (:require
   [clojure.string :as string]
   [reagent.core :as r]
   [reagent.dom :as rdom]
   [reitit.frontend :as rf]
   [reitit.frontend.easy :as rfe]
   [reitit.coercion.spec :as rss]
   [clojure.spec.alpha :as s]
   [fipp.edn :as fedn]
   [cljs-http.client :as http]
   [cljs.core.async :refer [<!]]
   ["react" :as preact]))

(defonce match (r/atom nil))

(defn home-page [_state]
  [:div
   [:h1 "iNatViewer"]
   [:form {:action (rfe/href ::obs-view) :method "GET"}
    [:input {:name "url" :placeholder "URL" :value "https://www.inaturalist.org/observations?q=huey.xyz&user_id=hueyl"}]
    [:button {:type "submit"} "VIEW"]]])

(def obs-regex #"(?i)^(https://www\.?inaturalist\.org/)(observations)(.*)")
(defn get-observations [url]
  (when (nil? (re-find obs-regex url))
    (js/window.alert "Oops! That doesn't look like an iNaturalist observations URL")
    (rfe/push-state ::frontpage))
  (let [json-url (string/replace url obs-regex "$1$2.json$3")]
    (go (let [response (<! (http/get json-url))]
          (try
            (-> response :body first)
            (catch js/object e
              (.error js/console e)
              (js/window.alert "Oops! Something went wrong when fetching iNaturalist observations")
              []))))))

(defn observations-list [observation]
  (prn observation)
  ;; (let [name (-> observation :taxon :name)]
  ;;   [:div
  ;;    [:strong name]])
  [])

(defn observations-viewer [match]
  (let [{:keys [query]} (:parameters match)
        url (:url query)
        observations (r/atom [])]
    (preact/useState)
    (preact/useEffect (fn []
                        ;; (reset! observations [])
                        (go (reset! observations (get-observations url))))
                      [])
    (prn @observations)
    [:div
     [:h1 "OBSERVATIONS VIEWER"]
     [:p url]
     (map observations-list [])]))

(defn image-viewer [match]
  (let [{:keys [query]} (:parameters match)
        url (:url query)]
    [:div
     [:h1 "IMAGE VIEWER"]
     [:p url]]))

(defn current-page []
  [:div
   [:ul
    [:li [:a {:href (rfe/href ::frontpage)} "Homepage"]]
    [:li [:a {:href (rfe/href ::obs-view)} "Viewer"]]]
   (if @match
     (let [view (:view (:data @match))]
       [view @match])
     [:pre (with-out-str (fedn/pprint @match))])])

(def routes
  [["/"
    {:name ::frontpage
     :view home-page}]
   ["/obs_view"
    {:name ::obs-view
     :view observations-viewer
     :parameters {:query (s/keys :req-un [::url])}}]
   ["/img_view"
    {:name ::img-view
     :view image-viewer
     :parameters {:query (s/keys :req-un [::url])}}]])

(defn start {:dev/after-load true} []
  (rfe/start!
   (rf/router routes {:data {:coercion rss/coercion}})
   (fn [m] (reset! match m))
   {:use-fragment false})
  (rdom/render [current-page] (js/document.getElementById "app")))

(defn init []
  (start))
