import i18next from 'i18next';
import Backend from 'i18next-multiload-backend-adapter';

i18next.use(Backend).init({
  backend: {
    backend: {},
    backendOption: {}
  },
});
